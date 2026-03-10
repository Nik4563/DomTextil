// появление меню
document.addEventListener('DOMContentLoaded', function(){
    const catalogBtn = document.getElementById('catalogBtn');
    const catalogMenu = document.getElementById('catalogMenu');
    const body = document.body;

    const overlay = document.createElement('div');
    overlay.className = 'catalog-overlay';
    document.body.appendChild(overlay);

    function openMenu(){
        catalogBtn.classList.add('active');
        catalogMenu.classList.add('active');
        overlay.classList.add('active');
        body.classList.add('menu-open');
    }
    function closeMenu(){
        catalogBtn.classList.remove('active');
        catalogMenu.classList.remove('active');
        overlay.classList.remove('active');
        body.classList.remove('menu-open');
    }

    catalogBtn.addEventListener('click', function(e){
        e.stopPropagation();

        if (catalogMenu.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }

    });

    overlay.addEventListener('click', function(){
        closeMenu();
    });
    
    // === Закрытие по клику вне меню ===
    document.addEventListener('click', function(e){
        // Если клик не по меню и не по кнопке — закрыть
        if (!catalogMenu.contains(e.target) && !catalogBtn.contains(e.target)) {
            closeMenu();
        }
    });
});