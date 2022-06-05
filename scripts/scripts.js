let bannerSlideIndex = 0,
  homeProductSlideActive = 0,
  homeBannerLength = 0;
// For product mobile slide
let posX1, posX2;
let slideInterval;

let isMouseEntered = false;

$(document).ready(() => {
  slideInterval = setInterval(autoSlider, 10000);
  productDotClickSlider();
  bannerDragSlider();
  addToWishlist();
  setBannerWidth();
  bannerDotClickSlider();
  let isCarousel = document.querySelector(".owl-carousel")

  if(isCarousel){
    $(".owl-carousel").owlCarousel({
      loop: true,
      margin: 10,
      nav: false,
      responsive: {
        0: {
          items: 2,
        },
        768: {
          items: 4,
        },
      },
    });
  }

  if ($(window).innerWidth() <= 768) {
    productTouchSlider();
  }
});

const closeOrderStatus = () => {
  $(".popup-container").animate({trasnform:"scale(0)"},300, () => {
    $(".popup-bg").animate({opacity:0},300,()=>{
      $(".popup-bg").css("display","none")
    })
  })
}

const setupImageZoom = () => {
  let image = $(".main-image"),
    zoomLens = $(".img-zoom-lens"),
    result = $(".image-preview"),
    zoomBox = document.querySelector(".zoom-box")

  console.log(zoomBox.offsetWidth,zoomBox.offsetHeight);
  zoomLens.css("display","block")



  result.css({
    display: "block",
    width: zoomBox.offsetWidth + "px",
    height: zoomBox.offsetHeight + "px",

  })


  if(!isMouseEntered){
    image.mousemove(moveLens)
    isMouseEntered = true;
  }

  cx = zoomBox.offsetWidth / zoomLens.width();
  cy = zoomBox.offsetHeight / zoomLens.height()

  result.css({
    backgroundImage: `url(${image.attr('src')})`,
    backgroundSize : (image.width() * cx) + "px " + (image.height() * cy) + "px",
  })
  
  // zoomLens.mousemove(moveLens)

  getCursorPosition()
  
}

const moveLens = (e) => {
  let lens = document.querySelector(".img-zoom-lens")
  let img = document.querySelector(".main-image")
  let zoomLens = $(".img-zoom-lens")
  let  result = $(".image-preview")
  let pos = getCursorPosition(e)
  let x = pos.x - (lens.offsetWidth / 2)
  let y = pos.y - (lens.offsetHeight / 2)
  
  if(x < 0) x = 0
  if(y < 0) y = 0
  if(x > img.width - lens.offsetWidth) x = img.width - lens.offsetWidth
  if(y > img.height - lens.offsetHeight) y = img.height - lens.offsetHeight
  $(".img-zoom-lens").css({
    left: x + "px",
    top: y + "px"
  })

  cx = result.width() / zoomLens.width();
  cy = result.height() / zoomLens.height()

  $(".image-preview").css({
    backgroundPosition:  "-" + (x * cx) + "px -" + (y * cy) + "px"
  })
  
}

const getCursorPosition = (e) => {
  e = e || window.event;
  let bouding = document.querySelector(".main-image").getBoundingClientRect()
  posX = e.pageX - bouding.left
  posY = e.pageY - bouding.top
  posX = posX - window.pageXOffset;
  posY = posY - window.pageYOffset;
  return {x:posX,y:posY}
}

const closeZoom = () => {
  console.log("here");
  $(".img-zoom-lens").css("display","none")
  $(".image-preview").css("display","none")
}

const setBannerWidth = () => {
  let carousel = $(".carousel");
  let isAvailable = document.querySelector(".carousel")
  if (isAvailable) {
    homeBannerLength = carousel[0].children.length;
    carousel.css("width", `${homeBannerLength * 100}%`);
    for (let i = 0; i < homeBannerLength; i++) {
      i == 0
        ? $(".dots").append("<li class='dot dot__active'></li>")
        : $(".dots").append("<li class='dot'></li>");
    }
  }
};



// Banner slide functions
const autoSlider = () => {
  if (bannerSlideIndex === homeBannerLength - 1) {
    direction = "backward";
  } else if (bannerSlideIndex === 0) {
    direction = "forward";
  }

  direction === "forward" ? bannerSlideIndex++ : bannerSlideIndex--;

  $(".carousel").css("margin-left", `-${bannerSlideIndex * 100}%`);
  $(".dot__active").removeClass("dot__active");
  $(".dot").eq(bannerSlideIndex).addClass("dot__active");
};

const bannerDotClickSlider = () => {
  $(".dot").click((event) => {
    event.preventDefault();
    var index = $(".dot").index(event.target);
    bannerSlideIndex = index;

    clearInterval(slideInterval);

    $(".carousel").css("margin-left", `-${bannerSlideIndex * 100}%`);
    $(".dot__active").removeClass("dot__active");
    $(".dot").eq(bannerSlideIndex).addClass("dot__active");

    slideInterval = setInterval(autoSlider, 5000);
  });
};
const bannerDragSlider = () => {
  let pos1, pos2;
  $(".carousel").on("mousedown", (event) => {
    event = event || window.event;
    pos1 = event.originalEvent.clientX;
    $(".carousel").css({ cursor: "grabbing" });
  });
  $(".carousel").on("mouseup", (event) => {
    event = event || window.event;
    pos2 = event.originalEvent.clientX;
    bannerSliderController(pos1, pos2);
    $(".carousel").css({ cursor: "grab" });
  });

  $(".carousel").on("touchstart", (event) => {
    event = event || window.event;
    pos1 = event.originalEvent.clientX;
  });
  $(".carousel").on("touchend", (event) => {
    event = event || window.event;
    let touch = event.touches[0] || event.changedTouches[0];
    posX2 = touch.pageX;
    bannerSliderController(pos1, pos2);
  });
};

const bannerSliderController = (pos1, pos2) => {
  if (pos1 > pos2 && pos1 - pos2 > 100) {
    if (bannerSlideIndex !== homeBannerLength - 1) {
      bannerSlideIndex++;
    }
  } else if (pos2 > pos1 && pos2 - pos1 > 100) {
    if (bannerSlideIndex !== 0) {
      bannerSlideIndex--;
    }
  }
  clearInterval(slideInterval);
  $(".carousel").css("margin-left", `-${bannerSlideIndex * 100}%`);
  $(".dot__active").removeClass("dot__active");
  $(".dot").eq(bannerSlideIndex).addClass("dot__active");
  slideInterval = setInterval(autoSlider, 5000);
};

// home product slide
const slideHomeProducts = (direction) => {
  var owl = $(".owl-carousel");
  owl.owlCarousel();

  if (direction === "forward") {
    owl.trigger("next.owl.carousel");
  } else if (direction === "back") {
    owl.trigger("prev.owl.carousel");
  }
};

const productDotClickSlider = () => {
  $(".product--dot").click((event) => {
    event.preventDefault();
    var index = $(".product--dot").index(event.target);
    homeProductSlideActive = index;

    setNavigationButton();

    $(".products--slider").css(
      "margin-left",
      `-${homeProductSlideActive * 100}%`
    );
    setTimeout(() => {
      $(".product--dot__active").removeClass("product--dot__active");
      $(".product--dot")
        .eq(homeProductSlideActive)
        .addClass("product--dot__active");
    }, 1000);
  });
};

const setNavigationButton = () => {
  if (homeProductSlideActive === 2) {
    $(".forward-navigation").css("opacity", 0);
  } else {
    $(".forward-navigation").css("opacity", 1);
  }

  if (homeProductSlideActive === 0) {
    $(".backward-navigation").css("opacity", 0);
  } else {
    $(".backward-navigation").css("opacity", 1);
  }
};

const productTouchSlider = () => {
  let flag = 0;
  $(".products--slider").on("touchstart", (event) => {
    event = event || window.event;
    if (event.type === "touchstart") {
      posX1 = event.touches[0].clientX;
    } else {
      posX1 = event.clientX;
    }
    flag = 1;
  });
  $(".products--slider").on("touchend", (event) => {
    event = event || window.event;
    let touch = event.touches[0] || event.changedTouches[0];
    posX2 = touch.pageX;
    if (flag === 1) {
      productSlide();
    }
  });
};

const productSlide = () => {
  if (posX1 > posX2 && posX1 - posX2 > 60) {
    slideHomeProducts("forward");
  } else if (posX1 < posX2 && posX2 - posX1 > 60) {
    slideHomeProducts("back");
  }
};

// Search opening
const openSearch = () => {
  $(".search-icon--link").animate({ "font-size": 0 }, 300, () => {
    $(".search-container").css({ display: "block" });
    $(".search-wrapper").css({ display: "flex" });
    $(".search-container").animate(
      {
        height: "100%",
      },
      100,
      () => {
        $(".search-wrapper").animate({ opacity: 1 }, 300);
      }
    );
  });
  $(".search-icon-wrapper").animate({ width: 0, margin: 0 });
};

const closeSearch = () => {
  $(".search-wrapper").animate({ opacity: 0 }, 100, () => {
    $(".search-container").animate({ height: 0 }, 100, () => {
      $(".search-container").css({ display: "none" });
      $(".search-wrapper").css({ display: "none" });
      $(".search-icon-wrapper").animate({ width: "1.5rem", margin: "0 1rem" });
      $(".search-icon--link").animate({ "font-size": "1.5rem" }, 300);
    });
  });
};

// Opening and closing of modal & modal related functions

const openModal = () => {
  $(".modal-wrapper").css({ display: "flex" });
  $(".modal-wrapper").animate({ opacity: 1 }, 200, () => {
    $(".modal-container").animate({ opacity: 1 }, 500);
  });
};

const closeModal = () => {
  $(".modal-container").animate({ opacity: 0 }, 100, () => {
    $(".modal-wrapper").animate({ opacity: 0 }, 100, () => {
      $(".modal-wrapper").css({ display: "none" });
    });
  });
};

// Menu toggling functions
const toggleMenu = () => {
  let index = 0;
  $(".menu-icon").toggleClass("active");
  $(".mobile-menu").toggleClass("mobile-menu__active");

  const menuItems = $(".menu--item");
  const menuLength = menuItems.length;

  menuItems.css({ opacity: 0 });
  for (let i = 0; i < menuLength; i++) {
    setTimeout(() => {
      menuItems.eq(i).animate({ opacity: 1 });
    }, 200);
  }
};

// Filter animations
const openFilter = () => {
  $(".filter-navigation").css({ display: "block" });
  $(".filter-navigation").animate({ opacity: 1 }, 300);
};

const openSellerFilter = () => {
  $(".seller--navigation-wrapper").css({ display: "block" });
  $(".seller--navigation-wrapper").animate({ opacity: 1 }, 300);
};

const orderFilter = () => {
  $(".filter-container").css({ display: "block" });
  $(".filter-container").animate({ opacity: 1 }, 300);
};

const closeFilter = () => {
  $(".filter-navigation").animate({ opacity: 0 }, 300, () => {
    $(".filter-navigation").css({ display: "none" });
  });
};
const closeSellerFilter = () => {
  $(".seller--navigation-wrapper").animate({ opacity: 0 }, 300, () => {
    $(".seller--navigation-wrapper").css({ display: "none" });
  });
};

const closeOrder = () => {
  $(".filter-container").animate({ opacity: 0 }, 300, () => {
    $(".filter-container").css({ display: "none" });
  });
};

// Profile page

//*Change Password slide
const openPasswordChange = () => {
  $(".change-password--wrapper").slideDown(100, () => {
    $(".change-password--wrapper").css({ display: "flex" });
    $(".change-password--wrapper").animate({ opacity: 1 }, 100);
  });
};

const addToWishlist = () => {
  $(".wishlist-outlined").click((event) => {
    event.target.innerHTML = "favorite";
    event.target.styles();
  });
};

const avatar = (index) => {
  $(".clicked").css({ "border-color": "#C4C4C4" });
  $(".clicked")
    .eq(index - 1)
    .css({ "border-color": "red" });
};

//manage address input field appears

const addAddress = () => {
  $(".new-address-wrapper").addClass("none-new-address");
  $(".checkout-input-container").addClass("active-fields");
  $(".manage-address-card").addClass("card-active");
};

//option active
const optionActive = (index) => {
  $(".options-wrapper").eq(index).toggleClass("options-wrapper-active");
};

//wish list heart
const romanticmode = (event) => {
  event.target.innerHTML = "favorite";
};

const productromantic = () => {
  $(".material-icons").click(function () {
    $(this).toggleClass("heart");
  });
};

/// product-page

const productSelect = (event, index) => {
  $(".main-image").attr("src", event.target.src);
  $(".slide").css({ "border-color": "#C4C4C4" });
  $(".slide")
    .eq(index - 1)
    .css({ "border-color": "red" });
};

// const cartPlaceOrder = () => {
//   window.location.href = "checkout.html";
// };
// const goToSellerPage = () => {
//   window.location.href = "landing.html";
// };
// const gotoSellers = () => {
//   window.location.href = "sellers.html";
// };

// Size btn click handler
sizeClickHandler = (event) => {
  $(".btn-size-active").removeClass("btn-size-active");
  event.target.classList.add("btn-size-active");
};