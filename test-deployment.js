// Test script for deployment verification
const testChatAPI = async () => {
    const testMessage = "Hello, tell me about Captain Swayam";
    const testContext = "Test context for portfolio";
    
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: testMessage,
                context: testContext
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ API Test Successful:', data.response);
            return true;
        } else {
            console.error('❌ API Test Failed:', response.status, response.statusText);
            return false;
        }
    } catch (error) {
        console.error('❌ API Test Error:', error);
        return false;
    }
};

// Run test when script loads
if (typeof window !== 'undefined') {
    window.testChatAPI = testChatAPI;
    console.log('Deployment test script loaded. Run testChatAPI() to verify API.');
}