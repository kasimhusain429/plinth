// Shared by the browser form and the API route so both agree on the rules.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const TOPICS = [
  { value: "rent", label: "I’m looking to rent" },
  { value: "viewing", label: "I’d like to book a viewing" },
  { value: "landlord", label: "I want to list my property" },
  { value: "other", label: "Something else" },
];

export function validateInquiry(data) {
  const errors = {};
  const name = String(data.name || "").trim();
  const email = String(data.email || "").trim();
  const phone = String(data.phone || "").trim();
  const message = String(data.message || "").trim();

  if (name.length < 2) errors.name = "Please tell us your name.";
  if (!EMAIL.test(email)) errors.email = "Please enter a valid email address.";
  if (phone && !/^[+\d][\d\s()\-.]{5,}$/.test(phone)) errors.phone = "That phone number doesn’t look right.";
  if (message.length > 2000) errors.message = "Please keep your message under 2000 characters.";
  if (data.topic === "other" && message.length < 10) errors.message = "A few words about what you need would help.";
  if (!data.consent) errors.consent = "Please agree so we can reply to you.";

  return { valid: Object.keys(errors).length === 0, errors };
}
