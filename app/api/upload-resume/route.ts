import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import mammoth from 'mammoth';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI || "");

export async function POST(request: NextRequest) {
  let fileName = 'unknown';
  
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    fileName = file.name;

    // Validate file type - check both MIME type and file extension
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'image/jpeg',
      'image/jpg',
      'image/png'
    ];

    const fileExtension = fileName.toLowerCase().split('.').pop();
    const allowedExtensions = ['pdf', 'doc', 'docx', 'txt', 'jpeg', 'jpg', 'png'];

    // Check both MIME type and file extension for better compatibility
    const isValidMimeType = allowedTypes.includes(file.type);
    const isValidExtension = fileExtension && allowedExtensions.includes(fileExtension);

    if (!isValidMimeType && !isValidExtension) {
      return NextResponse.json({ 
        error: `Invalid file type. Supported formats: PDF, DOC, DOCX, TXT, JPEG, JPG, PNG. Received: ${file.type} (${fileExtension})` 
      }, { status: 400 });
    }

    // Log file information for debugging
    console.log(`Processing file: ${fileName}, MIME type: ${file.type}, Extension: ${fileExtension}`);

    // Additional file type detection for edge cases
    console.log(`File details: name=${fileName}, type=${file.type}, size=${file.size} bytes`);
    
    // Special handling for files uploaded from different systems that might have incorrect MIME types
    if (fileExtension === 'docx' && file.type === 'application/octet-stream') {
      console.log('Detected DOCX file with generic MIME type, proceeding with DOCX processing');
    } else if (fileExtension === 'doc' && file.type === 'application/octet-stream') {
      console.log('Detected DOC file with generic MIME type, proceeding with DOC processing');
    }

    // Get file buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Process with Gemini AI
    let extractedData;
    try {
      // Check if Gemini API key is available
      if (!process.env.NEXT_PUBLIC_GEMINI) {
        console.error('Gemini API key not found');
        return NextResponse.json({
          error: 'AI processing not configured. Please check API key configuration.'
        }, { status: 500 });
      }

      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      let prompt = '';
      let fileData = null;

      // Determine file processing method based on MIME type and extension
      if (file.type.startsWith('image/') || file.type === 'application/pdf') {
        // For images and PDFs, send directly to Gemini AI
        const base64Data = buffer.toString('base64');
        fileData = {
          inlineData: {
            data: base64Data,
            mimeType: file.type
          }
        };
        prompt = `Extract all information from this resume ${file.type === 'application/pdf' ? 'PDF' : 'image'} and format it as JSON with the following structure:`;
      } else if (file.type === 'text/plain' || fileExtension === 'txt') {
        // For text files, read content directly
        const textContent = buffer.toString('utf-8');
        prompt = `Extract all information from this resume text and format it as JSON with the following structure:\n\nResume content:\n${textContent}\n\n`;
      } else if (file.type === 'application/msword' || 
                 file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                 fileExtension === 'doc' || 
                 fileExtension === 'docx') {
        // For DOC/DOCX files, extract text using mammoth with enhanced options
        try {
          console.log('Processing DOCX/DOC file with mammoth...');
          
          // First, try simple raw text extraction
          let textContent = '';
          let extractionMethod = 'unknown';
          
          try {
            const textResult = await mammoth.extractRawText({ buffer });
            textContent = textResult.value;
            extractionMethod = 'raw-text';
            
            if (textResult.messages.length > 0) {
              console.log('Mammoth text extraction messages:', textResult.messages);
            }
            
            console.log(`Raw text extraction: ${textContent.length} characters`);
          } catch (rawTextError) {
            console.warn('Raw text extraction failed:', rawTextError);
          }
          
          // If raw text extraction failed or produced insufficient content, try HTML method
          if (textContent.length < 50) {
            try {
              console.log('Trying HTML extraction method...');
              const htmlResult = await mammoth.convertToHtml({ buffer });
              const htmlContent = htmlResult.value;
              extractionMethod = 'html-fallback';
              
              if (htmlResult.messages.length > 0) {
                console.log('Mammoth HTML extraction messages:', htmlResult.messages);
              }
              
              // Enhanced HTML to text conversion with better table handling
              textContent = htmlContent
                .replace(/<table[^>]*>/g, '\n--- TABLE START ---\n')
                .replace(/<\/table>/g, '\n--- TABLE END ---\n')
                .replace(/<tr[^>]*>/g, '\n')
                .replace(/<\/tr>/g, '')
                .replace(/<td[^>]*>/g, ' | ')
                .replace(/<\/td>/g, '')
                .replace(/<th[^>]*>/g, ' | ')
                .replace(/<\/th>/g, '')
                .replace(/<p[^>]*>/g, '\n')
                .replace(/<\/p>/g, '')
                .replace(/<br[^>]*\/?>|<br>/g, '\n')
                .replace(/<div[^>]*>/g, '\n')
                .replace(/<\/div>/g, '')
                .replace(/<h[1-6][^>]*>/g, '\n### ')
                .replace(/<\/h[1-6]>/g, ' ###\n')
                .replace(/<li[^>]*>/g, '\n- ')
                .replace(/<\/li>/g, '')
                .replace(/<ul[^>]*>|<\/ul>|<ol[^>]*>|<\/ol>/g, '\n')
                .replace(/<strong[^>]*>|<\/strong>|<b[^>]*>|<\/b>/g, '')
                .replace(/<em[^>]*>|<\/em>|<i[^>]*>|<\/i>/g, '')
                .replace(/<[^>]*>/g, ' ')
                .replace(/&nbsp;/g, ' ')
                .replace(/&amp;/g, '&')
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>')
                .replace(/&quot;/g, '"')
                .replace(/&#39;/g, "'")
                .replace(/&apos;/g, "'")
                .replace(/\|\s*\|/g, '|')
                .replace(/\s*\|\s*/g, ' | ')
                .replace(/\n\s*\n\s*\n/g, '\n\n')
                .replace(/[ \t]+/g, ' ')
                .replace(/\n +/g, '\n')
                .trim();
              
              console.log(`HTML extraction: ${textContent.length} characters`);
            } catch (htmlError) {
              console.warn('HTML extraction also failed:', htmlError);
            }
          }
          
          // Final validation
          if (textContent.length < 20) {
            // Try one more approach - read as plain text (for very simple docs)
            try {
              console.log('Trying plain text fallback...');
              const plainText = buffer.toString('utf-8');
              if (plainText.length > textContent.length) {
                textContent = plainText
                  .replace(/[^\x20-\x7E\n\r\t]/g, ' ') // Remove non-printable chars
                  .replace(/\s+/g, ' ')
                  .trim();
                extractionMethod = 'plain-text-fallback';
                console.log(`Plain text fallback: ${textContent.length} characters`);
              }
            } catch (plainTextError) {
              console.warn('Plain text fallback failed:', plainTextError);
            }
          }
          
          console.log(`Final extracted text (${extractionMethod}): ${textContent.length} characters`);
          console.log('Text preview:', textContent.substring(0, 300) + '...');
          
          // More lenient validation - allow shorter documents
          if (textContent.length < 10) {
            throw new Error('Document appears to be empty or completely unreadable. Please try saving the document in a different format (PDF recommended) or ensure the document contains readable text.');
          }
          
          // Check for garbled text (lots of special characters)
          const specialCharRatio = (textContent.match(/[^\w\s.,!?@()-]/g) || []).length / textContent.length;
          if (specialCharRatio > 0.5 && textContent.length < 100) {
            throw new Error('Document content appears to be corrupted or in an unsupported encoding. Please try converting to PDF format.');
          }
          
          prompt = `Extract all information from this resume document (${extractionMethod} extraction from DOCX/DOC format) and format it as JSON with the following structure:\n\nResume content:\n${textContent}\n\n`;
        } catch (docError) {
          console.error('Document parsing error:', docError);
          
          // Instead of returning an error, return a success response with fallback
          // This allows the frontend to handle it gracefully and show manual form
          const errorMessage = docError instanceof Error ? docError.message : 'Unknown error';
          
          return NextResponse.json({
            success: true,
            fileName: fileName,
            extractedData: {
              name: '',
              email: '',
              phone: '',
              skills: [],
              experience: [],
              education: [],
              summary: ''
            },
            aiProcessed: false,
            message: `Document parsing failed: ${errorMessage}. Please fill the form manually or try converting your document to PDF format.`,
            parseError: true
          });
        }
      } else {
        return NextResponse.json({
          error: 'Unsupported file type'
        }, { status: 400 });
      }

      prompt += `
{
  "name": "Full Name",
  "email": "email@example.com",
  "phone": "phone number",
  "dob": "Date of birth in YYYY-MM-DD format. This is VERY important - carefully look for any DOB, Date of Birth, Birth Date, or text containing 'born on' in the resume. When found, convert to YYYY-MM-DD format (e.g., 1990-05-15). If not found, return null. Do not mistake other dates like graduation or job start dates for DOB.",
  "location": {
    "city": "City name only. Extract just the city from the address, without any house number, street, or zip code. Look for context clues like 'residing in', 'based in', etc.",
    "state": "State or province name only. Extract just the state/province from the address.",
    "country": "Country name only. Extract just the country from the address. Default to 'India' if a country isn't explicitly mentioned but the resume appears to be from India."
  },
  "contactDetails": {
    "address": "address if available",
    "linkedin": "linkedin url if available",
    "github": "github url if available",
    "website": "personal website if available",
    "twitter": "twitter handle if available"
  },
  "socialLinks": ["array of social media links"],
  "experience": [
    {
      "company": "Company Name",
      "position": "Job Title",
      "tenure": "Duration (e.g., Jan 2020 - Dec 2022)",
      "startMonth": "Start month (e.g., January, Jan)",
      "startYear": "Start year (e.g., 2020)",
      "endMonth": "End month if available, or 'Present' if current job",
      "endYear": "End year if available, or current year if current job",
      "isCurrentJob": "true or false based on whether this is their current position",
      "description": "Job description",
      "skills": ["relevant skills used in this role - extract from job description"]
    }
  ],
  "projects": [
    {
      "name": "Project Name",
      "link": "project url if available",
      "description": "project description",
      "skills": ["technologies used"]
    }
  ],
  "skills": [
    "COMPREHENSIVE array of ALL skills - extract from EVERYWHERE in the resume:",
    "1. TECHNICAL SKILLS (for tech professionals):",
    "   - Programming languages, frameworks, libraries, tools",
    "   - Databases, cloud platforms, DevOps tools",
    "   - Software, IDEs, version control systems",
    "2. PROFESSIONAL SKILLS (inferred from work experience):",
    "   - If they 'led a team' → Team Leadership, People Management",
    "   - If they 'managed projects' → Project Management, Planning",
    "   - If they 'presented to clients' → Presentation Skills, Client Relations",
    "   - If they 'analyzed data/reports' → Data Analysis, Analytical Thinking",
    "   - If they 'coordinated with stakeholders' → Stakeholder Management",
    "   - If they 'trained employees' → Training & Development, Mentoring",
    "   - If they 'handled budgets' → Financial Management, Budget Planning",
    "3. DOMAIN-SPECIFIC SKILLS (based on industry/role):",
    "   - Marketing: Campaign Management, SEO, Social Media, Content Creation",
    "   - Sales: Lead Generation, Customer Acquisition, Negotiation",
    "   - Finance: Financial Analysis, Risk Assessment, Compliance",
    "   - HR: Recruitment, Performance Management, Employee Relations",
    "   - Operations: Process Optimization, Supply Chain, Quality Control",
    "4. SOFT SKILLS (mentioned or clearly demonstrated):",
    "   - Communication, Problem-solving, Critical Thinking",
    "   - Collaboration, Adaptability, Time Management",
    "   - Customer Service, Attention to Detail, Multi-tasking",
    "5. TOOLS & SOFTWARE (any mentioned):",
    "   - Microsoft Office, CRM systems, ERP software",
    "   - Design tools, Analytics platforms, etc.",
    "BE VERY COMPREHENSIVE - if someone worked in a role, they likely have the core skills for that role even if not explicitly stated"
  ],
  "education": [
    {
      "level": "Education level - classify exactly as one of: '10th', '12th', 'diploma', 'bachelor', 'master', 'phd', 'certificate'",
      "institution": "School/University/College Name",
      "degree": "Degree Name or Program Name",
      "field": "Field of Study or Subject",
      "year": "Graduation/Passing Year as a 4-digit number (e.g., 2020). Look for text like 'graduated', 'completed', 'class of', 'passed', etc.",
      "startYear": "Start year of education if available",
      "endYear": "End/graduation year if available",
      "score": "GPA/Percentage/CGPA if mentioned",
      "board": "For 10th/12th, extract the board name like CBSE, ICSE, State Board, etc."
    }
  ],
  "secondaryEducation": {
    "institution": "10th standard school name",
    "board": "Board name for 10th standard (like CBSE, ICSE, State Board)",
    "year": "Year of passing 10th standard",
    "percentage": "Percentage or grade obtained in 10th"
  },
  "higherSecondaryEducation": {
    "institution": "12th standard school/college name",
    "board": "Board name for 12th standard",
    "stream": "Stream in 12th (like Science, Commerce, Arts)",
    "year": "Year of passing 12th standard",
    "percentage": "Percentage or grade obtained in 12th"
  },
  "certifications": [
    {
      "name": "Certification Name",
      "issuer": "Issuing Organization",
      "date": "Date of Issue"
    }
  ],
  "summary": "A long summary of the resume, including key achievements and career highlights, techniques used, and any notable contributions."
}

CRITICAL SKILL EXTRACTION INSTRUCTIONS:
- Extract ALL skills comprehensively - both explicitly mentioned AND inferred from work experience
- For TECHNICAL professionals: Include programming languages, frameworks, tools, databases, cloud platforms, methodologies (Agile, DevOps), system architecture, etc.
- For NON-TECHNICAL professionals: Include soft skills, business skills, industry expertise, client management, sales, marketing, finance, operations, etc.
- ANALYZE job descriptions for implied skills:
  * "managed team" → Team Management, Leadership, People Management
  * "client presentations" → Presentation Skills, Client Relations, Communication
  * "analyzed reports" → Data Analysis, Critical Thinking, Report Writing
  * "coordinated projects" → Project Coordination, Planning, Organization
  * "handled budgets" → Financial Management, Budget Planning
  * "trained staff" → Training & Development, Mentoring, Knowledge Transfer
  * "increased sales" → Sales Skills, Business Development, Performance Optimization
  * "social media campaigns" → Social Media Marketing, Digital Marketing, Content Creation
- Include DOMAIN EXPERTISE based on job titles and industries
- For each role, consider what skills are REQUIRED to perform those duties successfully
- Aim for 20-40 comprehensive skills that truly represent their capabilities
- Be thorough but relevant - quality over quantity, but don't miss obvious skills

Return only the JSON object, no additional text or formatting.`;

      // Enhanced retry logic with exponential backoff for AI overload
      let result = null;
      let retryCount = 0;
      const maxRetries = 3;
      const baseDelay = 1000; // Start with 1 second

      while (retryCount <= maxRetries) {
        try {
          console.log(`AI request attempt ${retryCount + 1}/${maxRetries + 1}`);
          
          result = fileData
            ? await model.generateContent([prompt, fileData])
            : await model.generateContent(prompt);
          
          break; // Success, exit retry loop
          
        } catch (retryError) {
          retryCount++;
          console.log(`AI request attempt ${retryCount} failed:`, retryError);
          
          if (retryError instanceof Error) {
            const errorMessage = retryError.message.toLowerCase();
            
            // Check if it's a retryable error (overload, rate limit, temporary issues)
            if (errorMessage.includes('overloaded') || 
                errorMessage.includes('503') ||
                errorMessage.includes('rate limit') ||
                errorMessage.includes('temporarily unavailable')) {
              
              if (retryCount <= maxRetries) {
                const delay = baseDelay * Math.pow(2, retryCount - 1); // Exponential backoff
                console.log(`Retrying in ${delay}ms... (attempt ${retryCount}/${maxRetries})`);
                await new Promise(resolve => setTimeout(resolve, delay));
                continue; // Try again
              }
            }
          }
          
          // If we've exhausted retries or it's a non-retryable error, throw it
          throw retryError;
        }
      }

      if (!result) {
        throw new Error('Failed to get AI response after all retry attempts');
      }

      const response = await result.response;
      let text = response.text();

      // Log the raw AI response for debugging
      console.log('Raw AI response length:', text.length);
      console.log('Raw AI response preview:', text.substring(0, 200) + '...');

      try {
        // Clean up the response text
        text = text.replace(/```json\n?|\n?```/g, '').trim();
        
        // Additional cleanup for common AI response issues
        if (text.startsWith('```')) {
          text = text.replace(/^```[a-zA-Z]*\n?/, '').replace(/\n?```$/, '');
        }
        
        extractedData = JSON.parse(text);
        
        // Validate that we got the expected structure
        if (!extractedData.skills || !Array.isArray(extractedData.skills)) {
          console.warn('Skills array missing or invalid, providing fallback');
          extractedData.skills = [];
        }
        
        // Debug logging for education data extraction
        console.log('Successfully parsed AI response. Education data:', {
          education: extractedData.education,
          secondaryEducation: extractedData.secondaryEducation,
          higherSecondaryEducation: extractedData.higherSecondaryEducation,
          certifications: extractedData.certifications
        });
        
      } catch (parseError) {
        console.error('JSON parsing error:', parseError);
        console.error('Raw text that failed to parse:', text);
        
        // Try to extract just the JSON part if there's extra text
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            extractedData = JSON.parse(jsonMatch[0]);
          } catch (retryError) {
            console.error('Retry parsing also failed:', retryError);
            return NextResponse.json({
              error: 'Failed to parse AI response',
              rawResponse: text.substring(0, 1000), // Limit response size
              details: parseError instanceof Error ? parseError.message : 'Unknown parsing error'
            }, { status: 500 });
          }
        } else {
          return NextResponse.json({
            error: 'Failed to parse AI response - no valid JSON found',
            rawResponse: text.substring(0, 1000),
            details: parseError instanceof Error ? parseError.message : 'Unknown parsing error'
          }, { status: 500 });
        }
      }

    } catch (aiError) {
      console.error('Gemini AI error details:', aiError);
      
      // Check if it's a specific type of error
      if (aiError instanceof Error) {
        const errorMessage = aiError.message.toLowerCase();
        
        if (errorMessage.includes('overloaded') || errorMessage.includes('503')) {
          // Enhanced response for overloaded API with better user guidance
          return NextResponse.json({
            success: true,
            fileName: fileName,
            extractedData: {
              name: '',
              email: '',
              phone: '',
              skills: [],
              experience: [],
              education: [],
              summary: ''
            },
            aiProcessed: false,
            parseError: true,
            message: `AI service is temporarily overloaded due to high demand. Your file "${fileName}" was uploaded successfully. Please fill the form manually, or try uploading again in 2-3 minutes for auto-parsing.`,
            retryRecommended: true,
            estimatedRetryTime: '2-3 minutes'
          });
        }
        
        if (errorMessage.includes('quota') || errorMessage.includes('limit')) {
          return NextResponse.json({
            success: true,
            fileName: fileName,
            extractedData: {
              name: '',
              email: '',
              phone: '',
              skills: [],
              experience: [],
              education: [],
              summary: ''
            },
            aiProcessed: false,
            parseError: true,
            message: `AI service quota exceeded for today. Your file "${fileName}" was uploaded successfully. Please fill the form manually. Auto-parsing will be available again tomorrow.`,
            retryRecommended: false,
            quotaExceeded: true
          });
        }
        
        if (errorMessage.includes('api key') || errorMessage.includes('unauthorized')) {
          return NextResponse.json({
            error: 'AI service configuration error. Please contact support.',
            details: 'Invalid or missing API key'
          }, { status: 401 });
        }
      }
      
      // Generic AI error - provide enhanced fallback
      return NextResponse.json({
        success: true,
        fileName: fileName,
        extractedData: {
          name: '',
          email: '',
          phone: '',
          skills: [],
          experience: [],
          education: [],
          summary: ''
        },
        aiProcessed: false,
        parseError: true,
        message: 'AI processing encountered an error. File uploaded successfully - please fill the form manually.',
        error: 'AI processing failed - manual entry available'
      });
    }

    return NextResponse.json({
      success: true,
      fileName: file.name,
      extractedData: extractedData,
      aiProcessed: true
    });

  } catch (error) {
    console.error('Upload error:', error);
    
    // Return a fallback response that allows manual form filling
    return NextResponse.json({
      success: true,
      fileName: fileName,
      extractedData: {
        name: '',
        email: '',
        phone: '',
        skills: [],
        experience: [],
        education: [],
        summary: ''
      },
      aiProcessed: false,
      parseError: true,
      message: 'File uploaded successfully, but AI processing failed. Please fill the form manually.',
      error: 'AI processing failed, manual entry required'
    });
  }
}
