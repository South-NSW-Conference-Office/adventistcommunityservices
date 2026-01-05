import { Loader2 } from 'lucide-react';
import { useState, FormEvent } from 'react';
import { contactApi, ContactFormData, VolunteerApplicationData } from '../services/contactApi';

export function Contact() {
  const [formType, setFormType] = useState<'contact' | 'volunteer'>('contact');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validateForm = (formData: FormData) => {
    const newErrors: Record<string, string> = {};
    
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;

    if (!name || name.trim().length < 2) {
      newErrors.name = 'Please enter a valid name';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    const phoneRegex = /^[\d\s\-+()]{8,}$/;
    if (!phone || !phoneRegex.test(phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (formType === 'contact') {
      const subject = formData.get('subject') as string;
      const message = formData.get('message') as string;

      if (!subject || subject.trim().length < 3) {
        newErrors.subject = 'Please enter a subject';
      }

      if (!message || message.trim().length < 10) {
        newErrors.message = 'Please enter a message (minimum 10 characters)';
      }
    } else {
      const availability = formData.get('availability') as string;
      const interests = formData.get('interests') as string;
      const motivation = formData.get('motivation') as string;

      if (!availability) {
        newErrors.availability = 'Please select your availability';
      }

      if (!interests) {
        newErrors.interests = 'Please select an area of interest';
      }

      if (!motivation || motivation.trim().length < 20) {
        newErrors.motivation = 'Please share your motivation (minimum 20 characters)';
      }
    }

    return newErrors;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const newErrors = validateForm(formData);

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      if (formType === 'contact') {
        const contactData: ContactFormData = {
          name: formData.get('name') as string,
          email: formData.get('email') as string,
          phone: formData.get('phone') as string,
          subject: formData.get('subject') as string,
          message: formData.get('message') as string,
        };
        await contactApi.submitContactForm(contactData);
      } else {
        const volunteerData: VolunteerApplicationData = {
          name: formData.get('name') as string,
          email: formData.get('email') as string,
          phone: formData.get('phone') as string,
          availability: formData.get('availability') as VolunteerApplicationData['availability'],
          interests: formData.get('interests') as VolunteerApplicationData['interests'],
          experience: (formData.get('experience') as string) || undefined,
          motivation: formData.get('motivation') as string,
        };
        await contactApi.submitVolunteerApplication(volunteerData);
      }

      setSubmitSuccess(true);
      form.reset();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (fieldName: string) => {
    if (errors[fieldName]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const handleFormTypeChange = (type: 'contact' | 'volunteer') => {
    setFormType(type);
    setErrors({});
    setSubmitSuccess(false);
    setSubmitError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F44314] via-[#F97023] to-[#F98344]">
      {/* Hero Section */}
      <div className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Gradient Background with decorative circles */}
        <div className="absolute inset-0">
          <div className="absolute inset-0">
            {/* Decorative circles */}
            <div className="absolute top-20 right-20 w-96 h-96 rounded-full bg-white/5 blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full bg-white/10 blur-3xl"></div>
            <div className="absolute bottom-20 left-10 w-32 h-32 rounded-full border-2 border-white/20"></div>
            <div className="absolute top-1/3 left-1/4 w-2 h-2 rounded-full bg-white/30"></div>
            <div className="absolute top-1/2 right-1/3 w-3 h-3 rounded-full bg-white/20"></div>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 py-32 text-center">
          <p className="text-white/90 text-sm tracking-wider uppercase mb-4">Contact Us</p>
          <h1 className="text-white text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Get In Touch
          </h1>
          <p className="text-white/90 text-lg mb-4 leading-relaxed max-w-3xl mx-auto">
            We'd love to hear from you. Whether you need assistance, have questions about our services, or want to join our team of dedicated volunteers, we're here to help.
          </p>
          <p className="text-white/80 mb-10 leading-relaxed max-w-3xl mx-auto">
            Our team is committed to responding to all inquiries promptly and connecting you with the right resources. Reach out today and become part of our community making a difference across Australia.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => handleFormTypeChange('contact')}
              className={`px-8 py-4 rounded-xl font-semibold transition-all shadow-lg ${
                formType === 'contact'
                  ? 'bg-white text-[#F44314]'
                  : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
              }`}
            >
              Contact Us
            </button>
            <button
              onClick={() => handleFormTypeChange('volunteer')}
              className={`px-8 py-4 rounded-xl font-semibold transition-all shadow-lg ${
                formType === 'volunteer'
                  ? 'bg-white text-[#F44314]'
                  : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
              }`}
            >
              Become a Volunteer
            </button>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            {formType === 'contact' ? (
              <>
                <h3 className="text-white text-2xl font-semibold mb-6">Contact Information</h3>
                <p className="text-white/80 mb-8">
                  Our offices are open to assist you with any inquiries, whether you need emergency support, have questions about our services, or want to learn more about how we can help. Adventist Community Services operates multiple locations across Australia, providing accessible support to communities in need with compassionate and professional staff. We've created a welcoming environment where everyone is treated with dignity and respect.
                </p>

                {/* Contact Images Masonry */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <img 
                      src="https://images.unsplash.com/photo-1725021059875-8f7fd08c843a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXN0cmFsaWElMjBzeWRuZXklMjBvZmZpY2UlMjBidWlsZGluZ3xlbnwxfHx8fDE3NjYxOTgyMTh8MA&ixlib=rb-4.1.0&q=80&w=1080"
                      alt="ACS Office Building"
                      className="w-full h-48 object-cover rounded-2xl shadow-lg"
                    />
                  </div>
                  <div className="col-span-1">
                    <img 
                      src="https://images.unsplash.com/photo-1556761175-b413da4baf72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvZmZpY2UlMjByZWNlcHRpb24lMjBkZXNrfGVufDF8fHx8MTczNDU2Nzg5Nnww&ixlib=rb-4.1.0&q=80&w=1080"
                      alt="Reception Area"
                      className="w-full h-40 object-cover rounded-2xl shadow-lg"
                    />
                  </div>
                  <div className="col-span-1">
                    <img 
                      src="https://images.unsplash.com/photo-1497366216548-37526070297c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvZmZpY2UlMjBtZWV0aW5nJTIwcm9vbXxlbnwxfHx8fDE3MzQ1Njc4OTZ8MA&ixlib=rb-4.1.0&q=80&w=1080"
                      alt="Meeting Room"
                      className="w-full h-40 object-cover rounded-2xl shadow-lg"
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-white text-2xl font-semibold mb-6">Why Volunteer With Us?</h3>
                <p className="text-white/80 mb-8">
                  Join a community of passionate individuals making a real difference across Australia, where you'll gain valuable experience, meet inspiring people, and contribute to meaningful change in your local community. We provide comprehensive training, flexible scheduling, and ongoing support to ensure your volunteer experience is rewarding and impactful. Whether you can commit to a few hours a week or regular shifts, we have opportunities that fit your lifestyle.
                </p>

                {/* Volunteer Images Masonry */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-1">
                    <img 
                      src="https://images.unsplash.com/photo-1710092784814-4a6f158913b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2b2x1bnRlZXJzJTIwZm9vZCUyMGJhbmslMjBoZWxwaW5nfGVufDF8fHx8MTc2NjM3MDE3Nnww&ixlib=rb-4.1.0&q=80&w=1080"
                      alt="Food Bank Volunteers"
                      className="w-full h-56 object-cover rounded-2xl shadow-lg"
                    />
                  </div>
                  <div className="col-span-1">
                    <img 
                      src="https://images.unsplash.com/photo-1722336762551-831c0bcc2b59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjB2b2x1bnRlZXJzJTIwcGFja2luZyUyMGNsb3RoZXN8ZW58MXx8fHwxNzY2MzcwMTc2fDA&ixlib=rb-4.1.0&q=80&w=1080"
                      alt="Clothing Assistance"
                      className="w-full h-56 object-cover rounded-2xl shadow-lg"
                    />
                  </div>
                  <div className="col-span-2">
                    <img 
                      src="https://images.unsplash.com/photo-1657558638549-9fd140b1ab5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2b2x1bnRlZXJzJTIwaGVscGluZyUyMGVsZGVybHl8ZW58MXx8fHwxNzY2MzcwMTc3fDA&ixlib=rb-4.1.0&q=80&w=1080"
                      alt="Community Support"
                      className="w-full h-48 object-cover rounded-2xl shadow-lg"
                    />
                  </div>
                  <div className="col-span-1">
                    <img 
                      src="https://images.unsplash.com/photo-1758599668125-e154250f24bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2b2x1bnRlZXJzJTIwdGVhbXdvcmslMjBjb21tdW5pdHl8ZW58MXx8fHwxNzY2MzcwMTc3fDA&ixlib=rb-4.1.0&q=80&w=1080"
                      alt="Teamwork"
                      className="w-full h-40 object-cover rounded-2xl shadow-lg"
                    />
                  </div>
                  <div className="col-span-1">
                    <img 
                      src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2b2x1bnRlZXJzJTIwaGFwcHklMjBjb21tdW5pdHl8ZW58MXx8fHwxNzM0NTY3ODk3fDA&ixlib=rb-4.1.0&q=80&w=1080"
                      alt="Happy Volunteers"
                      className="w-full h-40 object-cover rounded-2xl shadow-lg"
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Contact Form */}
          <div>
            <h3 className="text-white text-2xl font-semibold mb-6">
              {formType === 'contact' ? 'Send us a message' : 'Volunteer Application'}
            </h3>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="block text-white/90 text-sm mb-2">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition-colors"
                  placeholder="Enter your name"
                  onChange={() => handleInputChange('name')}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block text-white/90 text-sm mb-2">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition-colors"
                  placeholder="Enter your email"
                  onChange={() => handleInputChange('email')}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="phone" className="block text-white/90 text-sm mb-2">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition-colors"
                  placeholder="Enter your phone"
                  onChange={() => handleInputChange('phone')}
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>
              
              {formType === 'contact' ? (
                <>
                  <div>
                    <label htmlFor="subject" className="block text-white/90 text-sm mb-2">Subject</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition-colors"
                      placeholder="How can we help?"
                      onChange={() => handleInputChange('subject')}
                    />
                    {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-white/90 text-sm mb-2">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition-colors resize-none"
                      placeholder="Tell us more about your inquiry..."
                      onChange={() => handleInputChange('message')}
                    ></textarea>
                    {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label htmlFor="availability" className="block text-white/90 text-sm mb-2">Availability</label>
                    <select
                      id="availability"
                      name="availability"
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-white/40 transition-colors"
                      onChange={() => handleInputChange('availability')}
                    >
                      <option value="" className="bg-[#F44314]">Select your availability</option>
                      <option value="weekdays" className="bg-[#F44314]">Weekdays</option>
                      <option value="weekends" className="bg-[#F44314]">Weekends</option>
                      <option value="flexible" className="bg-[#F44314]">Flexible</option>
                    </select>
                    {errors.availability && <p className="text-red-500 text-sm mt-1">{errors.availability}</p>}
                  </div>

                  <div>
                    <label htmlFor="interests" className="block text-white/90 text-sm mb-2">Areas of Interest</label>
                    <select
                      id="interests"
                      name="interests"
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-white/40 transition-colors"
                      onChange={() => handleInputChange('interests')}
                    >
                      <option value="" className="bg-[#F44314]">Select your interest</option>
                      <option value="foodbank" className="bg-[#F44314]">Food Bank Services</option>
                      <option value="clothing" className="bg-[#F44314]">Clothing Assistance</option>
                      <option value="counseling" className="bg-[#F44314]">Counseling Support</option>
                      <option value="emergency" className="bg-[#F44314]">Emergency Relief</option>
                      <option value="admin" className="bg-[#F44314]">Administrative Support</option>
                    </select>
                    {errors.interests && <p className="text-red-500 text-sm mt-1">{errors.interests}</p>}
                  </div>

                  <div>
                    <label htmlFor="experience" className="block text-white/90 text-sm mb-2">Relevant Experience (Optional)</label>
                    <textarea
                      id="experience"
                      name="experience"
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition-colors resize-none"
                      placeholder="Tell us about any relevant experience or skills..."
                    ></textarea>
                  </div>

                  <div>
                    <label htmlFor="motivation" className="block text-white/90 text-sm mb-2">Why do you want to volunteer with us?</label>
                    <textarea
                      id="motivation"
                      name="motivation"
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition-colors resize-none"
                      placeholder="Share what motivates you to volunteer..."
                      onChange={() => handleInputChange('motivation')}
                    ></textarea>
                    {errors.motivation && <p className="text-red-500 text-sm mt-1">{errors.motivation}</p>}
                  </div>
                </>
              )}
              
              {/* Success Message */}
              {submitSuccess && (
                <div className="p-4 rounded-lg bg-green-500/20 border border-green-500/40 text-white">
                  {formType === 'contact'
                    ? 'Your message has been sent successfully! We will get back to you soon.'
                    : 'Your volunteer application has been submitted successfully! We will review it and get back to you soon.'}
                </div>
              )}

              {/* Error Message */}
              {submitError && (
                <div className="p-4 rounded-lg bg-red-500/20 border border-red-500/40 text-white">
                  {submitError}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-white text-[#F44314] font-semibold py-3 px-6 rounded-lg hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {formType === 'contact' ? 'Sending...' : 'Submitting...'}
                  </>
                ) : (
                  formType === 'contact' ? 'Send Message' : 'Submit Application'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}