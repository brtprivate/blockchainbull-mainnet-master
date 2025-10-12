// Logo loading test utility
import LOGO_CONFIG from '../assets/logo';

export const testLogoLoading = async (): Promise<{
  importedLogo: boolean;
  fallbackLogo: boolean;
  errors: string[];
}> => {
  const errors: string[] = [];
  let importedLogo = false;
  let fallbackLogo = false;

  // Test imported logo
  try {
    const img = new Image();
    await new Promise((resolve, reject) => {
      img.onload = () => {
        importedLogo = true;
        resolve(true);
      };
      img.onerror = () => {
        errors.push(`Imported logo failed to load: ${LOGO_CONFIG.image}`);
        reject(new Error('Imported logo failed'));
      };
      img.src = LOGO_CONFIG.image;
    });
  } catch (error) {
    // Continue to test fallback
  }

  // Test fallback logo
  try {
    const img = new Image();
    await new Promise((resolve, reject) => {
      img.onload = () => {
        fallbackLogo = true;
        resolve(true);
      };
      img.onerror = () => {
        errors.push(`Fallback logo failed to load: ${LOGO_CONFIG.fallback}`);
        reject(new Error('Fallback logo failed'));
      };
      img.src = LOGO_CONFIG.fallback;
    });
  } catch (error) {
    errors.push(`Both logo sources failed to load`);
  }

  return {
    importedLogo,
    fallbackLogo,
    errors
  };
};

// Console test function
export const runLogoTest = async () => {
  console.log('🔍 Testing logo loading...');
  console.log('📁 Base URL:', import.meta.env.BASE_URL);
  console.log('🖼️ Imported logo path:', LOGO_CONFIG.image);
  console.log('🔄 Fallback logo path:', LOGO_CONFIG.fallback);
  
  const result = await testLogoLoading();
  
  console.log('✅ Test Results:');
  console.log('  - Imported logo:', result.importedLogo ? '✅ Working' : '❌ Failed');
  console.log('  - Fallback logo:', result.fallbackLogo ? '✅ Working' : '❌ Failed');
  
  if (result.errors.length > 0) {
    console.log('❌ Errors:');
    result.errors.forEach(error => console.log('  -', error));
  }
  
  return result;
};
