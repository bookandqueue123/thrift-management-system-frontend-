import ContactUs from '@/modules/HomePage/ContactUs';
import React from 'react';

const ContactUsPage: React.FC = () => {
    return (
        <div>
            <ContactUs
            contactPhone={

               
                   "+234 809 722 7051"
              }
              contactMail={
               "finkia.support@raoatech.com"
              }
            />
        </div>
    );
};

export default ContactUsPage;