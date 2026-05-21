export type SupportEmailData = {
  fullName: string;
  email: string;
  phone?: string;
  ageRange?: string;
  audience?: string;
  supportType: string;
  contactMethod: string;
  message: string;
  consent: boolean;
};

export type VolunteerEmailData = {
  fullName: string;
  email: string;
  phone: string;
  areasOfInterest: string;
  skills: string;
  availability: string;
  whyVolunteer: string;
};

export type ContactEmailData = {
  fullName: string;
  email: string;
  subject: string;
  message: string;
};

export type NewsletterEmailData = {
  email: string;
};
