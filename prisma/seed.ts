import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Hash the admin password
  const hashedPassword = await bcrypt.hash('admin123', 12)
  // Check if admin user already exists
  let adminUser = await prisma.user.findUnique({
    where: { email: 'admin@tropl.ai' }
  })

  if (!adminUser) {
    // Create admin user with recruiter role
    adminUser = await prisma.user.create({
      data: {
        email: 'admin@tropl.ai',
        name: 'Admin User',
        role: 'RECRUITER',
        password: hashedPassword,
        verified: true,
      },
    })
    console.log('✅ Created admin user:', adminUser.email)
  } else {
    console.log('✅ Admin user already exists:', adminUser.email)
  }
  // Check if recruiter profile already exists
  let recruiterProfile = await prisma.recruiter.findUnique({
    where: { userId: adminUser.id }
  })

  if (!recruiterProfile) {
    recruiterProfile = await prisma.recruiter.create({
      data: {
        userId: adminUser.id,
        companyName: 'Tropl',
        department: 'HR',
        designation: 'Admin',
        experience: 5,
      },
    })
    console.log('✅ Created recruiter profile for admin')
  } else {
    console.log('✅ Recruiter profile already exists for admin')
  }

  // Create a sample candidate user
  const candidateUser = await prisma.user.create({
    data: {
      email: 'candidate@example.com',
      phone: '+1234567890',
      name: 'John Candidate',
      role: 'CANDIDATE',
      verified: true,    },
  })

  const recruiter = await prisma.recruiter.create({
    data: {
      userId: adminUser.id,
      companyName: 'Tech Solutions Inc',
      department: 'Human Resources',
      designation: 'Senior Recruiter',
      experience: 5,
    },
  })

  // Create candidate users
  const candidateUser1 = await prisma.user.create({
    data: {
      email: 'john.doe@example.com',
      phone: '+1234567891',
      name: 'John Doe',
      role: 'CANDIDATE',
      verified: true,
    },
  })

  const candidateUser2 = await prisma.user.create({
    data: {
      email: 'jane.smith@example.com',
      phone: '+1234567892',
      name: 'Jane Smith',
      role: 'CANDIDATE',
      verified: true,
    },
  })

  // Create candidate profiles
  const candidate1 = await prisma.candidate.create({
    data: {
      userId: candidateUser1.id,
      firstName: 'John',
      lastName: 'Doe',
      jobTitle: 'Senior Software Developer',
      experience: 5,
      expectedSalary: 90000,
      currentSalary: 75000,
      location: 'New York, NY',
      skills: ['React', 'Node.js', 'TypeScript', 'Python', 'AWS'],
      availability: 'AVAILABLE',
      profileSummary: 'Experienced full-stack developer with expertise in modern web technologies.',
      education: JSON.stringify([
        {
          degree: 'Bachelor of Computer Science',
          institution: 'University of Technology',
          year: 2018,
        },
      ]),
      workExperience: JSON.stringify([
        {
          company: 'Tech Corp',
          position: 'Software Developer',
          duration: '2018-2023',
          description: 'Developed web applications using React and Node.js',
        },
      ]),
    },
  })

  const candidate2 = await prisma.candidate.create({
    data: {
      userId: candidateUser2.id,
      firstName: 'Jane',
      lastName: 'Smith',
      jobTitle: 'Product Manager',
      experience: 3,
      expectedSalary: 85000,
      currentSalary: 70000,
      location: 'San Francisco, CA',
      skills: ['Product Strategy', 'Agile', 'User Research', 'Data Analysis'],
      availability: 'NOTICE_PERIOD',
      profileSummary: 'Results-driven product manager with a track record of successful product launches.',
      education: JSON.stringify([
        {
          degree: 'Master of Business Administration',
          institution: 'Business School',
          year: 2020,
        },
      ]),
      workExperience: JSON.stringify([
        {
          company: 'Startup Inc',
          position: 'Product Manager',
          duration: '2020-2023',
          description: 'Led product development from conception to launch.',
        },
      ]),
    },
  })

  // Create clients
  const client1 = await prisma.client.create({
    data: {
      name: 'Tech Solutions Inc',
      contactPerson: 'Alice Johnson',
      email: 'alice@techsolutions.com',
      phone: '+1234567800',      address: '123 Business St, New York, NY 10001',
      website: 'https://techsolutions.com',
      status: 'ACTIVE',
    },
  })

  const client2 = await prisma.client.create({
    data: {
      name: 'Global Services Ltd',
      contactPerson: 'Bob Wilson',
      email: 'bob@globalservices.com',
      phone: '+1234567801',      address: '456 Corporate Ave, San Francisco, CA 94102',
      website: 'https://globalservices.com',
      status: 'ACTIVE',
    },
  })

  // Create vendors
  const vendor1 = await prisma.vendor.create({
    data: {
      name: 'Recruitment Partners',
      contactPerson: 'Carol Davis',
      email: 'carol@recruitmentpartners.com',
      phone: '+1234567810',
      address: '789 Vendor Blvd, Chicago, IL 60601',
      specialization: ['IT Recruitment', 'Executive Search'],
      status: 'ACTIVE',
      rating: 4.5,
    },
  })

  // Create jobs
  const job1 = await prisma.job.create({
    data: {
      jobCode: 'JOB-001',
      clientJobId: 'TSI-001',
      title: 'Senior React Developer',
      description: 'We are looking for an experienced React developer to join our team.',      requirements: [
        'React.js',
        'TypeScript',
        'Node.js',
        'AWS',
        '5+ years experience',
      ],
      location: 'New York, NY',
      jobType: 'FULL_TIME',
      experienceLevel: 'SENIOR_LEVEL',
      minSalary: 80000,
      maxSalary: 120000,
      currency: 'USD',
      status: 'OPEN',
      priority: 'HIGH',
      openings: 2,
      clientId: client1.id,
      vendorId: vendor1.id,
      recruiterId: recruiter.id,
    },
  })

  const job2 = await prisma.job.create({
    data: {
      jobCode: 'JOB-002',
      clientJobId: 'GSL-001',
      title: 'Product Manager',
      description: 'Seeking a product manager to lead our product initiatives.',      requirements: [
        'Product Management',
        'Agile Methodology',
        'User Research',
        '3+ years experience',
      ],
      location: 'San Francisco, CA',
      jobType: 'FULL_TIME',
      experienceLevel: 'MID_LEVEL',
      minSalary: 90000,
      maxSalary: 130000,
      currency: 'USD',
      status: 'OPEN',
      priority: 'MEDIUM',
      openings: 1,
      clientId: client2.id,
      recruiterId: recruiter.id,
    },
  })

  // Create job applications
  const application1 = await prisma.jobApplication.create({
    data: {
      candidateId: candidate1.id,
      jobId: job1.id,
      status: 'APPLIED',
      notes: 'Interested in this position',
      coverLetter: 'I am excited to apply for this position...',
      currentStage: 'APPLIED',
      stageHistory: JSON.stringify([
        {
          stage: 'APPLIED',
          timestamp: new Date().toISOString(),
          notes: 'Application submitted',
        },
      ]),
    },
  })

  const application2 = await prisma.jobApplication.create({
    data: {
      candidateId: candidate2.id,
      jobId: job2.id,
      status: 'SHORTLISTED',
      notes: 'Great fit for the role',
      currentStage: 'SCREENING',
      stageHistory: JSON.stringify([
        {
          stage: 'APPLIED',
          timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          notes: 'Application submitted',
        },
        {
          stage: 'SCREENING',
          timestamp: new Date().toISOString(),
          notes: 'Moved to screening',
        },
      ]),
    },
  })

  // Create interviews
  const interview1 = await prisma.interview.create({
    data: {
      jobId: job1.id,
      candidateId: candidate1.id,
      recruiterId: recruiter.id,
      applicationId: application1.id,
      title: 'Technical Interview - React Developer',
      description: 'Technical discussion about React and frontend development',
      type: 'TECHNICAL',
      status: 'SCHEDULED',
      scheduledAt: new Date(Date.now() + 86400000), // Tomorrow
      duration: 60,
      meetingLink: 'https://meet.google.com/abc-def-ghi',
    },
  })

  const interview2 = await prisma.interview.create({
    data: {
      jobId: job2.id,
      candidateId: candidate2.id,
      recruiterId: recruiter.id,
      applicationId: application2.id,
      title: 'Product Manager Interview',
      description: 'Discussion about product management experience',
      type: 'HR_ROUND',
      status: 'COMPLETED',
      scheduledAt: new Date(Date.now() - 3600000), // 1 hour ago
      duration: 45,
      feedback: 'Great candidate with strong product sense',
      rating: 4,
      outcome: 'PROCEED_TO_NEXT_ROUND',
    },
  })

  console.log('Database seeded successfully!')
  console.log('Admin user:', adminUser.email)
  console.log('Recruiter user:', adminUser.email)
  console.log('Candidate users:', candidateUser1.email, candidateUser2.email)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
