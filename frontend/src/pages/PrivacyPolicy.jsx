import React, { useEffect } from 'react'
import { ShieldCheck, Eye, Share2, Cookie, Lock, Mail, ChevronLeft } from 'lucide-react'

const PrivacyPolicy = () => {

    // Scroll to top when page loads
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const policySections = [
        {
            icon: <Eye className="text-[tomato]" size={32} />,
            title: "1. Information We Collect",
            content: "We collect information you provide directly to us, such as when you create or modify your account, order services, contact customer support, or otherwise communicate with us. This information may include: name, email, phone number, delivery address, payment method information, and items ordered."
        },
        {
            icon: <ShieldCheck className="text-[tomato]" size={32} />,
            title: "2. How We Use Your Information",
            content: "We use the information we collect to provide, maintain, and improve our services, such as to facilitate payments, send receipts, provide products and services you request (and send related information), develop new features, provide customer support, and send administrative messages."
        },
        {
            icon: <Share2 className="text-[tomato]" size={32} />,
            title: "3. Sharing of Information",
            content: "We may share the information we collect about you as described in this statement or as described at the time of collection or sharing, including with our restaurants and delivery partners to enable them to fulfill your orders."
        },
        {
            icon: <Cookie className="text-[tomato]" size={32} />,
            title: "4. Cookies",
            content: "We use cookies and other identification technologies on our apps, websites, emails, and online ads for purposes such as: authenticating users, remembering user preferences and settings, and determining the popularity of content."
        },
        {
            icon: <Lock className="text-[tomato]" size={32} />,
            title: "5. Data Security",
            content: "We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction."
        },
        {
            icon: <Mail className="text-[tomato]" size={32} />,
            title: "6. Contact Us",
            content: "If you have any questions about this Privacy Policy, please contact us at privacy@yumgo.com. Our dedicated privacy team is ready to assist you with any concerns regarding your personal data."
        }
    ];

    return (
        <div className='privacy-policy privacy-policy-container bg-white min-h-screen pb-20'>
            {/* Hero Section */}
            <div className='relative h-[350px] bg-[#323232] flex items-center justify-center overflow-hidden'>
                <div className='absolute inset-0 opacity-20 bg-[url("/header_img.png")] bg-cover bg-center grayscale'></div>
                <div className='absolute inset-0 bg-gradient-to-b from-transparent to-black/40'></div>
                <div className='relative z-10 text-center flex flex-col items-center gap-4 px-[5vw]'>
                    <div className='p-4 bg-white/10 backdrop-blur-md rounded-3xl mb-2'>
                        <ShieldCheck size={48} className='text-[tomato]' />
                    </div>
                    <h1 className='text-white font-bold text-[max(3.5vw,36px)]'>Privacy Policy</h1>
                    <p className='text-gray-300 text-lg max-w-[600px]'>Your trust is our top priority. Learn how we protect your data while delivering your favorite meals.</p>
                </div>
            </div>

            {/* Content Grid */}
            <div className='max-w-[1200px] mx-auto px-[5vw] -mt-16 relative z-20'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                    {policySections.map((section, index) => (
                        <div key={index} className='bg-white p-10 rounded-[40px] shadow-[0px_15px_50px_rgba(0,0,0,0.08)] border border-gray-50 flex flex-col gap-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl'>
                            <div className='w-16 h-16 bg-[#fff4f2] rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-12'>
                                {section.icon}
                            </div>
                            <div className='flex flex-col gap-3'>
                                <h2 className='text-[#262626] text-2xl font-bold'>{section.title}</h2>
                                <p className='text-[#676767] leading-relaxed'>{section.content}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer Action */}
                <div className='flex flex-col items-center gap-8 mt-20 text-center bg-[#fcfcfc] p-12 rounded-[50px] border border-dashed border-gray-200'>
                    <div className='flex flex-col gap-2'>
                        <h3 className='text-2xl font-bold text-[#262626]'>Still have questions?</h3>
                        <p className='text-gray-500'>We're here to help you understand how your information is handled.</p>
                    </div>
                    <div className='flex gap-4'>
                        <button
                            onClick={() => window.history.back()}
                            className='flex items-center gap-2 bg-[#323232] text-white px-10 py-4 rounded-full font-bold hover:bg-black transition-all active:scale-95 shadow-lg'
                        >
                            <ChevronLeft size={20} /> Go Back
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PrivacyPolicy
