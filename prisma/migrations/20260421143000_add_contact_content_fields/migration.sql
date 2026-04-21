-- AlterTable
ALTER TABLE "SiteContent"
ADD COLUMN     "contactBody" TEXT NOT NULL DEFAULT 'Use the form to reach the Zenmora Co. inbox. Messages land in the admin panel so editorial requests and partnership inquiries are not lost.',
ADD COLUMN     "contactEyebrow" TEXT NOT NULL DEFAULT 'Contact',
ADD COLUMN     "contactFormEyebrow" TEXT NOT NULL DEFAULT 'Send a message',
ADD COLUMN     "contactFormTitle" TEXT NOT NULL DEFAULT 'Contact Zenmora Co.',
ADD COLUMN     "contactScopeBody" TEXT NOT NULL DEFAULT 'Brand collaborations, product features, styling consultations, reader questions, and press outreach.',
ADD COLUMN     "contactScopeTitle" TEXT NOT NULL DEFAULT 'Response scope',
ADD COLUMN     "contactSuccess" TEXT NOT NULL DEFAULT 'Your message has been received.',
ADD COLUMN     "contactTitle" TEXT NOT NULL DEFAULT 'Collaborations, sponsorships, and reader questions';
