"use strict";
let defaultSortingMethod = "percentDown";

let parseText = function(text, limit, ellipsis) {
  if (text.length > limit)
    for (let i = limit; i > 0; i--) {
      if (
        text.charAt(i) === " " &&
        (text.charAt(i - 1) != "," ||
          text.charAt(i - 1) != "." ||
          text.charAt(i - 1) != ";")
      ) {
        if (ellipsis) {
          return text.substring(0, i) + "...";
        } else {
          return text.substring(0, i);
        }
      }
    }
  else return text;
};

$(document).ready(function() {
  $.ajax({
    url:
      "http://codeit.pro/codeitCandidates/serverFrontendTest/company/getList",
    type: "get",
    success: function(response) {
      $(".loader-box").fadeOut();
      renderPage(response.list);
    }
  });
  $("#myInput").on("keyup", function() {
    let value = $(this)
      .val()
      .toLowerCase();
    $(".list-group-item").filter(function() {
      $(this).toggle(
        $(this)
          .text()
          .toLowerCase()
          .indexOf(value) > -1
      );
    });
  });

  function renderPage(list, isByLocation) {
    $(".counter-count, .companies-list").empty();
    const $companiesList = $(".companies-list");

    for (let i = 0; i < list.length; i++) {
      let $companyItem = $("<button/>");
      $companyItem.addClass(`list-group-item company-item`);
      $companyItem.text(list[i].name);
      $companiesList.append($companyItem);
      $companyItem.on("click", e => {
        if (!$(e.currentTarget).hasClass("active")) {
          $(e.currentTarget)
            .siblings()
            .removeClass("active");
          $(e.currentTarget).addClass("active");
          createPartners(list[i].partners);
          $(".partners-panel").slideDown();
        } else {
          $(e.currentTarget).removeClass("active");
          $(".partners-panel").slideUp();
        }

      });
    }
    $(".companies-list active").on("click", e => {
      $(e.currentTarget).removeClass("active");
      $(".partners-panel").slideUp();
    });
    runCounter(list.length);
    if (!isByLocation) {
      $("#chart-container").empty();
      createLocationChart(list);
    }
  }

  function createPartners(partnersList) {
    const $partnersBody = $(".partners-body").empty();

    const $partnerElement = $("<div/>", {
      class: "partners-element"
    }).append(
      $("<div/>", {
        class: "percent"
      }),
      $("<div/>", {
        class: "parthner-name-box"
      })
    );
    switch (defaultSortingMethod) {
      case "percentDown":
        partnersList.sort((a, b) => {
          return b.value - a.value;
        });
        break;
      case "percentUp":
        partnersList.sort((a, b) => {
          return a.value - b.value;
        });
        break;
      case "nameDown":
        partnersList.sort((a, b) => {
          var x = a.name.toLowerCase();
          var y = b.name.toLowerCase();
          if (x < y) {
            return 1;
          }
          if (x > y) {
            return -1;
          }
          return 0;
        });
        break;
      case "nameUp":
        partnersList.sort((a, b) => {
          var x = a.name.toLowerCase();
          var y = b.name.toLowerCase();
          if (x < y) {
            return -1;
          }
          if (x > y) {
            return 1;
          }
          return 0;
        });
        break;

      default:
        break;
    }
    for (let i = 0; i < partnersList.length; i++) {
      const partner = partnersList[i];
      const $curPartnerElement = $partnerElement.clone(true);
      $curPartnerElement.find(".percent").text(partner.value);
      $curPartnerElement.find(".parthner-name-box").text(partner.name);
      $curPartnerElement.appendTo($partnersBody);
      if (partner.name.length >= 5) {
        $curPartnerElement.find(".parthner-name-box").css("fontSize", 30);
        if (partner.name.length >= 10) {
          $curPartnerElement.find(".parthner-name-box").css("fontSize", 22);
        }
      }
    }
    $(".sort-by-name").off("click");
    $(".sort-by-percent").off("click");
    $(".sort-by-name").on("click", e => {
      $(".sort-by-percent").removeClass("active-up active-down");
      if ($(e.currentTarget).hasClass("active-up")) {
        $(e.currentTarget)
          .removeClass("active-up")
          .addClass("active-down");
        defaultSortingMethod = "nameDown";
        createPartners(partnersList);
      } else {
        if ($(e.currentTarget).hasClass("active-down")) {
          $(e.currentTarget)
            .removeClass("active-down")
            .addClass("active-up");

          defaultSortingMethod = "nameUp";
          createPartners(partnersList);
        } else {
          $(e.currentTarget).addClass("active-up");

          defaultSortingMethod = "nameUp";
          createPartners(partnersList);
        }
      }
    });
    $(".sort-by-percent").on("click", e => {
      $(".sort-by-name").removeClass("active-up active-down");
      if ($(e.currentTarget).hasClass("active-up")) {
        $(e.currentTarget)
          .removeClass("active-up")
          .addClass("active-down");

        defaultSortingMethod = "percentDown";
        createPartners(partnersList);
      } else {
        if ($(e.currentTarget).hasClass("active-down")) {
          $(e.currentTarget)
            .removeClass("active-down")
            .addClass("active-up");

          defaultSortingMethod = "percentUp";
          createPartners(partnersList);
        } else {
          $(e.currentTarget).addClass("active-up");

          defaultSortingMethod = "percentUp";
          createPartners(partnersList);
        }
      }
    });
  }

  function runCounter(total) {
    $(".counter-count")
      .prop("Counter", 0)
      .animate(
        {
          Counter: total
        },
        {
          duration: 1500,
          easing: "swing",
          step: function(now) {
            $(this).text(Math.ceil(now));
          }
        }
      );
  }

  function createLocationChart(list) {
    let data = [];
    let locationsList = {};
    for (let i = 0; i < list.length; i++) {
      const name = list[i].location.name;
      const code = list[i].location.code;
      if (locationsList.hasOwnProperty(name)) {
        locationsList[name].count++;
      } else {
        locationsList[name] = { code };
        locationsList[name].count = 1;
      }
    }

    for (const key in locationsList) {
      data.push({
        x: key,
        value: locationsList[key].count,
        code: locationsList[key].code
      });
    }

    const chart = anychart.pie();
    const legend = chart.legend();
    chart.data(data);
    chart.container("chart-container");
    legend.enabled(false);
    // // set legend position
    // legend.position("right");
    // // set items layout
    // legend.itemsLayout("vertical");
    chart.sort("desc");
    chart.listen("pointClick", e => {
      displayComaniesByLocation(list, e.iterator.get("code"));
      $(".location-in-title").text(`in ${e.iterator.get("x")}`);
    });
    chart.draw();
  }

  function displayComaniesByLocation(list, code) {
    const listByLocation = [];
    for (let i = 0; i < list.length; i++) {
      if (list[i].location.code == code) {
        listByLocation.push(list[i]);
      }
    }
    $(".all-companies-btn").slideDown();
    renderPage(listByLocation, true);
    $(".all-companies-btn").click(e => {
      renderPage(list);
      $(e.currentTarget).slideUp();
      $(".location-in-title").empty();
    });
  }

  $.ajax({
    url: "http://codeit.pro/codeitCandidates/serverFrontendTest/news/getList",
    type: "get",
    success: function(response) {
      createNewsSection(response.list);
    }
  });

  function createNewsSection(list) {
    const $indicator = $(".carousel-indicators > li:nth-child(2");
    const $indicatorContainer = $(".carousel-indicators");
    const $carouselContainer = $(".carousel-inner");
    const $carouselItem = $(".carousel-inner > .item:nth-child(2)");

    for (let i = 0; i < list.length; i++) {
      const newsObj = list[i];
      if (i > 1) {
        const $newIndicator = $indicator.clone(true);
        $newIndicator.attr("data-slide-to", i);
        $newIndicator.appendTo($indicatorContainer);
        const $newItem = $carouselItem.clone(true);
        $newItem.appendTo($carouselContainer);
      }

      const $currentItem = $(`.carousel-inner > .item:eq(${i})`);
      $currentItem.find("a").attr("href", "http://" + newsObj.link);
      $currentItem.find("img").attr("src", newsObj.img);
      $currentItem.find(".news-author").text(newsObj.author);
      let date = new Date(+newsObj.date * 1000);
      let formatter = new Intl.DateTimeFormat("ru");
      let formatedDate = formatter.format(date);
      $currentItem.find(".news-date").text(formatedDate);

      $currentItem.find("h4").text(parseText(newsObj.description, 10, false));
      $currentItem
        .find("p:eq(0)")
        .text(parseText(newsObj.description, 310, true));
    }
  }
});
