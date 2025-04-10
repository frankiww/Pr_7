if ('serviceWorker' in navigator){
    window.addEventListener('load', async () => {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
            console.log('ServiceWorker зарегестрирован: ', registration.scope);
        } catch (err){
            console.error('Ошибка регистрации', err);
        }
    });
}

