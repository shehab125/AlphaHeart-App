import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      'Welcome to HealthConnect': 'Welcome to HealthConnect',
      'Book Appointment': 'Book Appointment',
      'Schedule your next medical appointment with our qualified doctors': 'Schedule your next medical appointment with our qualified doctors',
      'Book Now': 'Book Now',
      'Find Doctor': 'Find Doctor',
      'Search and connect with specialized doctors in your area': 'Search and connect with specialized doctors in your area',
      'Search Doctors': 'Search Doctors',
      'Nearby Hospitals': 'Nearby Hospitals',
      'Find the nearest hospitals and medical centers in your area': 'Find the nearest hospitals and medical centers in your area',
      'Find Hospitals': 'Find Hospitals',
      'Nearby Pharmacies': 'Nearby Pharmacies',
      'Locate the closest pharmacies to your current location': 'Locate the closest pharmacies to your current location',
      'Find Pharmacies': 'Find Pharmacies',
      'Medical Records': 'Medical Records',
      'Access your complete medical history and test results': 'Access your complete medical history and test results',
      'View Records': 'View Records',
      'Emergency Services': 'Emergency Services',
      'Quick access to emergency medical services and first aid information': 'Quick access to emergency medical services and first aid information',
      'Emergency Help': 'Emergency Help',
      'Your Location': 'Your Location',
      'Pharmacies List': 'Pharmacies List',
      'No pharmacies found nearby': 'No pharmacies found nearby',
      'Try Again': 'Try Again',
      'Go to location': 'Go to location',
      'Hospitals List': 'Hospitals List',
      'No hospitals found nearby': 'No hospitals found nearby'
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n; 