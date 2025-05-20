/* eslint-disable linebreak-style */
$(function() {
  const isTouch = !!("ontouchstart" in window || navigator.msMaxTouchPoints);
  const mobilePoint = 768;
  let sticky = $(widget).offset().top + $(widget).find('.layout__content').height() * 2;

  // Фикс для редактора, когда есть другие виджеты шапок
  if ($(widget).find('#header-with-left-menu').hasClass('is-editor')) {
    $(window).on('resize', () => {
      sticky = $(widget).offset().top + $(widget).find('.layout__content').height() * 2;
    })
  }

  function isMobileWidth() {
    return $(window).width() <= mobilePoint;
  }

  function getWidget(item) {
    return item.closest('.layout');
  }

  $(function() {
    if (isTouch) {
      $(widget).find(".header").addClass("is-touch");
    }
    if ($(window).width() >= mobilePoint) {
      $(widget).find(".js-cut-list").cutList({
        moreBtnTitle: '<span class="icon icon-ellipsis-h"></span>',
        alwaysVisibleElem: ".is-current",
      });
    }

    $(window).on('load', function() {
      $(widget).find(".js-cut-list").resize();
    });

    if ($(widget).find(".header__collections .is-current").length) {
      if (
        $(window).width() < mobilePoint ||
        $(widget).css("--catalog-location") == "side-panel"
      ) {
        $(widget).find(".header__collections .is-current").addClass("is-show");
      }
    }

    $(widget)
      .find(`.header-cat-menu .m-cat-menu li a[href="${location.pathname}"]`)
      .parents("li")
      .addClass("is-current");

    $(widget)
      .find(".header__collections-item")
      .hover(
        function() {
          let submenu = $(this).find("> .header__collections-submenu");

          if (
            submenu.length &&
            submenu.offset().left + submenu.innerWidth() > $(window).width()
          ) {
            submenu.addClass("is-right");
          }
        },
        function() {
          $(this).find("> .header__collections-submenu").removeClass("is-right");
        }
      );

    $(widget)
      .find(".js-show-touch-submenu")
      .on("click", function() {
        let root_item = $(this).parents(".header__collections-item:last");
        let cur_item = $(this).parents(".header__collections-item:first");
        let submenu = cur_item.find("> .header__collections-submenu");

        if ($(window).width() >= mobilePoint) {
          if ($(this).parents(".cut-list__more-content").length) {
            $(this)
              .parents(".cut-list__more-content")
              .find("> .header__collections-item.is-show")
              .each(function() {
                if ($(this).is(root_item) == false) {
                  $(this)
                    .removeClass("is-show is-right")
                    .find(".header__collections-item.is-show")
                    .removeClass("is-show is-right");
                }
              });
          } else {
            $(widget)
              .find(".header__collections > .header__collections-item.is-show")
              .each(function() {
                if ($(this).is(root_item) == false) {
                  $(this)
                    .removeClass("is-show is-right")
                    .find(".header__collections-item.is-show")
                    .removeClass("is-show is-right");
                }
              });
          }
        }

        cur_item.toggleClass("is-show");

        if (
          submenu.length &&
          submenu.offset().left + submenu.innerWidth() > $(window).width()
        ) {
          submenu.addClass("is-right");
        }
      });

    $(document).on("click", function(event) {
      if ($(event.target).closest(".header__collections").length) {
        return;
      }

      if (
        $(window).width() >= mobilePoint &&
        $(widget).css("--catalog-location") != "side-panel"
      ) {
        $(widget)
          .find(".header__collections-item")
          .removeClass("is-show is-right");
      }
    });

    $(widget)
      .find(".cut-list__drop-toggle")
      .on("click", function() {
        if ($(window).width() >= mobilePoint) {
          $(widget)
            .find(".header__collections-item")
            .removeClass("is-show is-right");
        }
      });

    $(widget)
      .find(".js-start-search")
      .on("click", function() {
        $(widget).find(".header__search-form")[0].submit();
      });

    $(widget)
      .find(".js-show-side-panel")
      .on("click", function() {
        $(widget).find(".header-overlay").addClass("is-show");
        $(widget).find(".side-panel").addClass("is-show");
        $(widget).find(".side-panel").css("visibility", "");
      });

    $(widget)
      .find(".js-hide-side-panel")
      .on("click", function() {
        $(widget).find(".header-overlay").removeClass("is-show");
        $(widget).find(".side-panel").removeClass("is-show");
      });

    $(widget)
      .find(".js-toggle-languages-list")
      .on("click", function() {
        $(this).parents(".header__area-languages").toggleClass("is-show");
      });

    function collectionMenuDesktop(thisWidget) {
      let menu = thisWidget.find(".header-cat-menu");

      function menuMousenter() {
        if (menu.hasClass('is-mobile')) {
          $(widget).find('.is-mobile .m-cat-menu__show-next-level').off('mouseenter', menuMousenter);

          return false;
        }

        $(this).children('.m-cat-menu__wrapper').removeAttr('style');
        $(this).children('.m-cat-menu__wrapper, .m-cat-menu').stop(true, true).delay(500).show(0, () => {
          if ($(this).children('.m-cat-menu__wrapper').get(0).scrollHeight > menu.height()) {
            menu.css('height', `${$(this).children('.m-cat-menu__wrapper').get(0).scrollHeight}px`);
            menu.find('.m-cat-menu').css('height', `${$(this).children('.m-cat-menu__wrapper').get(0).scrollHeight}px`);
          }
        });
      }

      function menuMouseleave() {
        if (menu.hasClass('is-mobile')) {
          $(widget).find('.is-mobile .m-cat-menu__show-next-level').off('mouseleave', menuMouseleave);

          return false;
        }

        function getMenuHeight() {
          if (menu.find('.m-cat-menu > ul').height() <= $(window).height() - menu[0].getBoundingClientRect().top && menu.hasClass('_show')) {
            return '100vh';
          } else {
            return 'auto';
          }
        }

        let targetListParentHeight = $(this).closest('.m-cat-menu__list').get(0).scrollHeight;
        let targetListChildrenHeight = $(this).find('.m-cat-menu__list').get(0).scrollHeight;

        $(this).children('.m-cat-menu__wrapper').stop(true, true).delay(500).hide(0, function() {
          if (targetListParentHeight < targetListChildrenHeight) {
            menu.css('height', getMenuHeight());
            menu.find('.m-cat-menu').css('height', getMenuHeight());
          }
        });
      }

      if (menu.hasClass('is-desktop')) {
        $(widget).find(".m-cat-menu__show-next-level").on('mouseenter', menuMousenter);
        $(widget).find(".m-cat-menu__show-next-level").on('mouseleave', menuMouseleave);
      }
    }

    function collectionMobileMenu(thisWidget) {
      let menu = thisWidget.find(".header-cat-menu");

      function showNextLevel(e) {
        if (menu.hasClass('is-desktop')) {
          $(widget).find('.m-cat-menu__show-next-level').off('click', showNextLevel);
          return true;
        }

        let target = $(e.target);

        if (target.is('.icon-angle-right')) {
          e.preventDefault();
          let $this = $(this);
          let targetListItem = $(e.target.closest('li'));
          let targetListParent = targetListItem.closest('.m-cat-menu__wrapper');
          let targetListChild = targetListItem.children('.m-cat-menu__wrapper');

          targetListChild.fadeIn(150);
          $(widget).find('.header-cat-menu, .m-cat-menu, .m-cat-menu__level-1').scrollTop(0);
          bodyScrollLock.disableBodyScroll(targetListChild.get(0));
          targetListChild.css('height', `calc(${window.innerHeight}px - ${menu[0].getBoundingClientRect().top}px`);
          menu.css('overflow-y', 'hidden');
          targetListParent.css('overflow-y', 'hidden');

          $($this.parents('.m-cat-menu__show-next-level')).each(function() {
            $(this).off('click', showNextLevel);
          });
        }
      }

      if (menu.hasClass('is-mobile')) {
        $(widget).find('.m-cat-menu__show-next-level').on('click', showNextLevel);
      }

      if (menu.hasClass('is-desktop')) {
        $(widget).find('.m-cat-menu__show-next-level').trigger('click');
      }

      $(widget).find('.m-cat-menu__back-btn').on('click', function(e) {
        e.preventDefault();
        let target = $(e.target);

        if (target.closest('.m-cat-menu__show-next-level')) {
          let targetListParent = target.closest('.m-cat-menu__wrapper');
          targetListParent.fadeOut(150);

          menu.css('overflow-y', 'hidden');
          targetListParent.parents('.m-cat-menu__wrapper').first().css('overflow-y', 'auto');

          let targetElement = targetListParent.parents('.m-cat-menu__wrapper').get(0);
          if (targetElement) {
            bodyScrollLock.disableBodyScroll(targetElement);
            targetListParent.parents('.m-cat-menu__wrapper').first().css('height', `calc(${window.innerHeight}px - ${menu[0].getBoundingClientRect().top}px)`)
          }

          target.closest('.m-cat-menu__show-next-level').on('click', showNextLevel);
        }
      });
    }

    function collectionMenuInit(thisWidget) {
      let menu = thisWidget.find(".header-cat-menu");

      if (isMobileWidth()) {
        if (menu.hasClass('is-desktop')) {
          collectionMenuDesktop(thisWidget);
          menu.removeClass('is-desktop');
        }

        if (menu.hasClass('is-mobile')) {
          collectionMobileMenu(thisWidget);
        } else {
          menu.addClass('is-mobile');
          collectionMobileMenu(thisWidget);
        }
      } else {
        if (menu.hasClass('is-mobile')) {
          collectionMobileMenu(thisWidget);
          menu.removeClass('is-mobile');
        }

        if (menu.hasClass('is-desktop')) {
          collectionMenuDesktop(thisWidget);
        } else {
          menu.addClass('is-desktop');
          collectionMenuDesktop(thisWidget);
        }
      }
    }

    $(widget)
      .find(".js-toggle-cat-menu")
      .on("click", function() {
        let thisWidget = getWidget($(this));
        let menu = thisWidget.find(".header-cat-menu");
        let mobileHeader = thisWidget.find(".header");

        $(this).children("span").toggleClass(["_show", "_hide"]);

        if ($(this).children("span").hasClass('_show')) {
          collectionMenuInit(thisWidget);
          thisWidget.on('resize', function() {
            collectionMenuInit(thisWidget);
          });
        }

        if ($(this).children("span.icon-bars").is("._hide")) {
          if (isMobileWidth()) {
            let targetElement = thisWidget.find(".header-cat-menu").get(0);
            if (targetElement) {
              bodyScrollLock.disableBodyScroll(targetElement);
            }
          }
        } else {
          if (isMobileWidth()) {
            bodyScrollLock.clearAllBodyScrollLocks();
          }
        }

        if ($(this).children("span.icon-bars").is("._hide")) {
          let targetElement = thisWidget.find(".header-cat-menu").get(0);
          if (targetElement) {
            bodyScrollLock.disableBodyScroll(targetElement);
            if ($(window).width() >= 1024) {
              $('body').css('padding-right', 'calc(15px - (100vw - 100%))');
              $('[data-fixed-panels="top"]').css('padding-right', 'calc(15px - (100vw - 100%))');
            }
          }
        } else {
          bodyScrollLock.clearAllBodyScrollLocks();
          if ($(window).width() >= 1024) {
            $('body').css('padding-right', 0);
            $('[data-fixed-panels="top"]').css('padding-right', '0');
          }
        }

        if (window.pageYOffset <= sticky) {
          $('html, body').animate({ scrollTop: 0 }, 300);
        }

        setTimeout(function() {
          let max_height = $(window).height() - menu.parent().offset().top - parseInt(menu.parent().css("height"));

          function getMenuHeight() {
            if (isMobileWidth() && menu.find('.m-cat-menu > ul').height() >= $(window).height() - parseInt(menu.parent().css("height")) && menu.hasClass('_show')) {
              return `calc(${window.innerHeight}px - ${menu.parent().css("height")}`;
            }

            if (menu.find('.m-cat-menu > ul').height() <= window.innerHeight - parseInt(menu.parent().css("height")) && menu.hasClass('_show')) {
              return `calc(${window.innerHeight}px - ${menu.parent().css("height")}`;
            } else {
              return 'auto';
            }
          }

          if (isMobileWidth()) {
            if (menu.find('.m-cat-menu > ul').height() <= $(window).height() - parseInt(menu.parent().css("height")) && menu.hasClass('_show')) {
              menu.find('.m-cat-menu').css({
                height: getMenuHeight()
              });
            } else {
              menu.find('.m-cat-menu').css({
                'overflow-y': 'scroll',
              });
            }

            menu.css({
              height: getMenuHeight(),
              top: mobileHeader.css('height'),
            });
          } else {
            menu.find('.m-cat-menu').css({
              height: getMenuHeight()
            });

            menu.css({
              height: getMenuHeight(),
              top: mobileHeader.closest('.layout__content').css('height'),
              maxHeight: max_height
            });
          }
        }, 0);

        menu.toggleClass(["_show", "_hide"]);

        if (!isMobileWidth()) {
          let offset = menu.parent().offset().left;
          menu.find(".m-cat-menu").css({
            paddingLeft: offset
          });
        } else {
          menu.find(".m-cat-menu").css({
            paddingLeft: '15px'
          });
        }

        if (menu.hasClass("_hide")) {
          menu.removeAttr('style');
          menu.find('.m-cat-menu, .m-cat-menu__wrapper').removeAttr('style');
        }
      });

    $(document).on("click", function(event) {
      let thisWidget = $(event.target.closest('.layout'));
      let menu = thisWidget.find(".header-cat-menu")

      if (
        $(event.target).closest(".js-toggle-cat-menu").length ||
        $(event.target).closest(".m-cat-menu").length
      ) {
        return;
      }

      let menu_button = thisWidget.find(".js-toggle-cat-menu");

      if (menu.hasClass("_show")) {
        menu.removeClass("_show").addClass("_hide");
        bodyScrollLock.clearAllBodyScrollLocks();
      }

      if (menu.hasClass("_hide")) {
        menu_button
          .children("span.icon-times")
          .removeClass("_show")
          .addClass("_hide");
        menu_button
          .children("span.icon-bars")
          .removeClass("_hide")
          .addClass("_show");
      }
    });
  });

  $(window).on("load", function() {
    $(widget).find(".js-cut-list-collections").resize();
    $(widget).find(".side-panel").css("visibility", "");
  });

  function debounce(func, wait) {
    let timeoutId;

    return function() {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(func, wait);
    };
  }

  $(window).on('scroll', debounce(function() {
    let headerHeight = $(widget).find('.header').height();
    function fixIOS() {
      let styleValue = $(widget).attr('style');
      let styleValueWithoutSpace = styleValue.replace(/:\s/g, ':');
      $(widget).attr('style', styleValueWithoutSpace);
    }

    if (isMobileWidth()) {
      console.log(headerHeight);
      if (window.pageYOffset >= sticky && !$(widget).find('.header').hasClass('sticky')) {
        $(widget).css({
          opacity: 0
        });

        $(widget).stop(true, true).animate({
          opacity: 1
        }, 300);

        $(widget).find('.header__area-logo, .header__area-search').stop(true, true).animate({
          transform: 'translateY(-200%)'
        }, {
          duration: 300,
          queue: false,
          step: function() {
            $(widget).find('.header__area-logo, .header__area-search').hide();
            $(widget).find('.header__content').css('grid-template-areas', '"burger controls"');
            $(widget).find('.header__content').css('grid-template-columns', '1fr');
            $(widget).find('.header__area-controls').css('height', '62px');
            $(widget).find('.header').addClass('sticky');
            $(widget).find('.filling-block').css('height', headerHeight);
            fixIOS();
          }
        });

      }

      if (window.pageYOffset <= sticky && $(widget).find('.header').hasClass('sticky')) {
        $(widget).stop(true, true).animate({
          opacity: 1
        }, 300);

        $(widget).find('.header__area-logo, .header__area-search').stop(true, true).animate({
          transform: 'translateY(200%)'
        }, {
          duration: 300,
          queue: false,
          step: function() {
            $(widget).find('.header__area-logo, .header__area-search').show();
            $(widget).find('.header__content').removeAttr('style');
            $(widget).find('.header__area-controls').css('height', 'auto');
            $(widget).find('.header').removeClass('sticky');
            $(widget).find('.filling-block').css('height', 0);
            fixIOS();
          }
        });
      }
    }
  }, 0));


  EventBus.subscribe(
    [
      "widget:input-setting:insales:system:editor",
      "widget:change-setting:insales:system:editor",
    ],
    () => {
      $(widget).find(".js-cut-list-collections").resize();
      $(widget).find(".header__search").removeClass("is-show");
      $(widget).find(".header__logo").removeClass("is-hide");
    }
  );
});
