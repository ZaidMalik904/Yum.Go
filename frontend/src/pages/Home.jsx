import React, { useState, useEffect, useContext } from 'react'
import Header from '../components/Header'
import RestaurantDisplay from '../components/RestaurantDisplay/RestaurantDisplay'
import AboutUs from '../components/AboutUs'
import { StoreContext } from '../context/StoreContext'

const Home = ({ setShowLogin }) => {

    const [category, setCategory] = useState("All");
    const { setMenu } = useContext(StoreContext);

    useEffect(() => {
        const sections = [
            { id: 'home', name: 'home' },
            { id: 'restaurant-display', name: 'restaurants' },
            { id: 'about-us', name: 'about-us' },
            { id: 'footer', name: 'contact-us' }
        ];

        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.5
        };

        const observerCallback = (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const sectionName = sections.find(s => s.id === entry.target.id)?.name;
                    if (sectionName) {
                        setMenu(sectionName);
                    }
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        sections.forEach((section) => {
            const element = document.getElementById(section.id);
            if (element) {
                observer.observe(element);
            }
        });

        return () => {
            sections.forEach((section) => {
                const element = document.getElementById(section.id);
                if (element) {
                    observer.unobserve(element);
                }
            });
        };
    }, [setMenu]);

    return (
        <div>
            <Header />
            <RestaurantDisplay />
            <AboutUs />
        </div>
    )
}

export default Home
