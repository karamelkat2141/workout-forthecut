<script>
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('./sw.js', { scope: './' })
                    .then((reg) => console.log('SW registered successfully:', reg))
                    .catch((err) => console.error('SW registration failed:', err));
            });
        }
    </script>
</body>
</html>
