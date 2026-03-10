// Плавный скролл для всех якорных ссылок "История"
    const links = document.querySelectorAll('a[href="#history"]');

    links.forEach(function(link){
        link.addEventListener('click', function(event){
            event.preventDefault();
            const historySection = document.getElementById('history');

            if(historySection){
                historySection.scrollIntoView({
                    behavior: "smooth",
                    block: 'start'
                })
            }
        })
    })

