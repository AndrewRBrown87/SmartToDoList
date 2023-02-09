// Client facing scripts here
$(document).ready(function() {
  const startConditions = {};
  startConditions.liMargin = parseInt($('li').css('marginTop')) + parseInt($('li').css('marginBottom'));
  startConditions.liHeight = $('li').outerHeight();
  startConditions.startHeight = (startConditions.liHeight * 2) + startConditions.liMargin + (startConditions.liMargin / 2);

  // this is the animation overlay it stays hidden until called.
  $(".overlay").addClass('hidden');

  //this animation function will fire on the sorting of the category. Takes category id
  //this animation function will fire on the sorting of the category. Takes category id
  const animateCatBox = (id => {
    const passID = id;
    let i = 0;
    const flashdiv = setInterval(function() {
      console.log(passID);
      const header = $(`#${passID}.category-header`);
      const footer = $(`#${passID}.category-footer`);
      i++;
      console.log(header);

      header.addClass('blink');
      footer.addClass('blink');

      setTimeout(function() {
        header.removeClass('blink');
        footer.removeClass('blink');
      },150);

      if (i === 4) clearInterval(flashdiv);
    },300, passID);

  });
  //this is the mobileStart conditions
  const mobileStart = function() {
    $("ul").height(startConditions.startHeight);
  };

  //this listener expands the category box and shrinks all other categories
  const mobileListenerExpand = function() {
    $(".category-footer").on('click', function() {
      const $idParent = $(this).parent().attr('id');
      const liLength = $(`#${$idParent} > ul > li`).length;
      const fullHeight = (startConditions.startHeight / 2) * liLength;
      //$(`#${$idParent} ul`).height(fullHeight);
      $(`#${$idParent} ul`).height('auto');
      $(`#${$idParent}`).siblings('.category-box').children('ul').height(startConditions.liMargin / 2);
      $(this).addClass('hidden');
      $(this).siblings('.category-footer-open').removeClass('hidden');
      $(`#${$idParent}`).siblings('.category-box').children('.category-footer').removeClass('hidden');
      $(`#${$idParent}`).siblings('.category-box').children('.category-footer-open').addClass('hidden');

    });
  };

  //this listener shrinks the category box and reveals all other categories
  const mobileListenerShrink = function() {
    $(".category-footer-open").on('click', function() {
      const $idParent = $(this).parent().attr('id');
      $(`#${$idParent} ul`).height(startConditions.startHeight);
      $(`#${$idParent}`).siblings('.category-box').children('ul').height(startConditions.startHeight);
      $(this).addClass('hidden');
      $(this).siblings('.category-footer').removeClass('hidden');
      $(`#${$idParent}`).siblings('.category-box').children('.category-footer').removeClass('hidden');
      $(`#${$idParent}`).siblings('.category-box').children('.category-footer-open').addClass('hidden');

    });
  };

  //this listener sorts the items in the categories list with drag and drop and updates the database with the new order. It also updates the category ID of the item if it is moved to a different category

  $('.sortable').sortable({
    connectWith: '.sortable',
    handle: '.grip',
    stop: function(event, ui) {
      //console.log('PLACEHOLDER: ', ui.item.parent().siblings('.category-header').attr('id'));
      const newCat = ui.item.parent().siblings('.category-header').attr('id');
      //console.log(newCat);
      animateCatBox(newCat);
    },
    update(event, ui) {
      const $list = $(this);
      const form = ui.item.find('form');
      const itemID = form.data('id');
      let categoryID = '';
      const categories = {
        restaurants: 2,
        movies: 1,
        books: 3,
        products: 4,
      };
      categoryID = categories[$list.closest('.category-box').attr('id')];
      const priorities = $list
        .find('li')
        .map((index, element) => {
          const itemForm = $(element).find('form');
          if (itemForm.length) {
            const itemID = itemForm.data('id');
            return { itemID, categoryID, priority: index + 1 };
          }
        })
        .get();
      if (priorities.length) {
        $.post('/update-item-details', { priorities }).done(function() {
          // animateCatBox(categoryID);
        });
      }
      if ($(window).width() >= 1024) {
        if ($('#restaurants-list li').length >= 1) {
          $('#restaurants-list').height('auto');
        } else {
          $('#restaurants-list').height(48);
        }

        if ($('#movies-list li').length >= 1) {
          $('#movies-list').height('auto');
        } else {
          $('#movies-list').height(48);
        }

        if ($('#books-list li').length >= 1) {
          $('#books-list').height('auto');
        } else {
          $('#books-list').height(48);
        }

        if ($('#products-list li').length >= 1) {
          $('#products-list').height('auto');
        } else {
          $('#products-list').height(48);
        }
      }
    },
  });

  if ($(window).width() < 1024) {
    mobileStart();
    mobileListenerExpand();
    mobileListenerShrink();
  }

  $(window).on('resize', function() {
    let win = $(this);
    if (win.width() >= 1024) {
      $('ul').height('auto');

    } else if (win.width() < 1024) {
      mobileStart();
      mobileListenerExpand();
      mobileListenerShrink();
    }
  });

});
