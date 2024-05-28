const tg = window.Telegram.WebApp;
let user_input = {};
let temp_choice = {};
let dates = {};

tg.MainButton.text = "Продолжить";
tg.MainButton.onClick(function() {make_price_list(temp_choice, user_input)});
// tg.SettingsButton.show();
// tg.showAlert(tg.initDataUnsafe.user);

// Окно оплаты 
function send() {
    user_input["temp_choice"] = temp_choice;
    fetch("https://d5dis6e9n8u7aslnm6tt.apigw.yandexcloud.net/give", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Create-Invoice-Request": "true",
      },
      body: JSON.stringify(user_input),
    })
      .then((response) => response.json())
      .then((data) => tg.openInvoice(data))
      .catch((error) => {
        tg.showAlert("Ошибка формирования счета: " + error);
      });
}

function save_data() {
  user_input['temp_choice'] = temp_choice;
  user_input['user_info'] = {'id': tg.initDataUnsafe.user.id, 'name': tg.initDataUnsafe.user.first_name}
  fetch("https://d5diuud2nvnnoe0io4pd.apigw.yandexcloud.net/paste", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-save-bros-data": "true",
    },
    body: JSON.stringify(user_input),
  })
    .then((response) => response.json())
    .then((data) => tg.showAlert(JSON.stringify(data)))
    .catch((error) => {
      tg.showAlert("Ошибка сохранения данных: " + error);
    });
}

// Получение данных из таблиц на прод
{
    async function fetchData() {
        try {
          const response = await fetch(
            "https://d5diuud2nvnnoe0io4pd.apigw.yandexcloud.net/give"
          );
          const data = await response.json();
          return data;
        } catch (error) {
          console.error("Error fetching data:", error);
          throw error;
        }
    }
      
    (async () => {
    try {
        dates = await fetchData();
        date_set_func(dates);
        make_calendar();
    } catch (error) {
        console.error("Error:", error);
    }
    })();
}

function main_button_checkout(temp_choice) {
    if (Object.keys(temp_choice).length != 0) {
        if (!tg.MainButton.isVisible) {
            tg.enableClosingConfirmation();
            tg.MainButton.text = 'Продолжить';
            tg.MainButton.show();
        }
    } else {
        if (tg.MainButton.isVisible) {
            tg.disableClosingConfirmation();
            tg.MainButton.hide();
        }
    }
}

// До прода
// let dates = {
//   "27.02.2024": {
//     "11:00": [
//       ["1", "1", "Свободно"],
//       ["1", "2", "Свободно"],
//       ["1", "3", "Свободно"],
//       ["2", "1", "Забронировано"],
//       ["2", "2", "Забронировано"],
//       ["2", "3", "Свободно"],
//       ["3", "1", "Забронировано"],
//       ["3", "2", "Свободно"],
//       ["3", "3", "Свободно"],
//     ],
//     "15:00": [
//       ["1", "1", "Забронировано"],
//       ["1", "2", "Свободно"],
//       ["1", "3", "Свободно"],
//       ["1", "4", "Забронировано"],
//       ["2", "1", "Свободно"],
//       ["2", "2", "Забронировано"],
//       ["2", "3", "Свободно"],
//       ["2", "4", "Забронировано"],
//       ["3", "1", "Свободно"],
//       ["3", "2", "Свободно"],
//       ["3", "3", "Забронировано"],
//       ["3", "4", "Забронировано"],
//       ["4", "1", "Свободно"],
//       ["4", "2", "Забронировано"],
//       ["4", "3", "Забронировано"],
//       ["4", "4", "Забронировано"],
//       ["4", "5", "Забронировано"],
//       ["4", "6", "Свободно"],
//     ],
//   },
//   "28.02.2024": {
//     "17:00": [
//       ["1", "1", "Забронировано"],
//       ["1", "2", "Свободно"],
//       ["1", "3", "Свободно"],
//       ["1", "4", "Свободно"],
//       ["1", "5", "Забронировано"],
//       ["1", "6", "Забронировано"],
//       ["2", "1", "Забронировано"],
//       ["2", "2", "Забронировано"],
//       ["2", "3", "Забронировано"],
//     ],
//     "23:00": [
//       ["2", "4", "Свободно"],
//       ["2", "5", "Забронировано"],
//       ["2", "6", "Забронировано"],
//       ["3", "1", "Забронировано"],
//       ["3", "2", "Забронировано"],
//       ["3", "3", "Забронировано"],
//       ["3", "4", "Забронировано"],
//       ["3", "5", "Свободно"],
//       ["3", "3", "Забронировано"],
//     ],
//   },
//   "29.02.2024": {
//     "23:50": [
//       ["1", "1", "Забронировано"],
//       ["1", "2", "Свободно"],
//       ["1", "3", "Забронировано"],
//       ["1", "4", "Забронировано"],
//       ["1", "5", "Свободно"],
//       ["1", "6", "Свободно"],
//       ["2", "1", "Свободно"],
//       ["2", "2", "Забронировано"],
//       ["2", "3", "Свободно"],
//       ["2", "4", "Свободно"],
//       ["2", "5", "Забронировано"],
//       ["2", "6", "Свободно"],
//       ["3", "1", "Свободно"],
//       ["3", "2", "Свободно"],
//       ["3", "3", "Забронировано"],
//       ["3", "4", "Забронировано"],
//       ["3", "5", "Свободно"],
//       ["3", "6", "Забронировано"],
//     ],
//   },
// };

function date_set_func(dates){
  valid_days = Object.keys(dates).map((dateString) => {
    const day = dateString.split(".")[0];
    return day;
    });
}

// Показ карточек
{
  const calendar_view = document.querySelector(".calendar_view");
  const time_view = document.querySelector(".time_view");
  const cinema_view = document.querySelector(".cinema_view");
  const price_list = document.querySelector(".price-list");

  // Обработчики для места
  function click_handler_second(e) {
    if (!Object.keys(temp_choice).includes(e.target.parentNode.id)) {
      temp_choice[e.target.parentNode.id] = [];
    }
    temp_choice[e.target.parentNode.id].push(e.target.id);

    if (temp_choice[e.target.parentNode.id].indexOf(e.target.id) !== -1) {
      temp_choice[e.target.parentNode.id] = temp_choice[
        e.target.parentNode.id
      ].filter(function (item) {
        return item !== e.target.id;
      });
      if (temp_choice[e.target.parentNode.id].length == 0) {
        delete temp_choice[e.target.parentNode.id];
      }
    }

    main_button_checkout(temp_choice);
    e.target.removeEventListener("click", click_handler_second);
    e.target.classList.remove("selected");
    e.target.addEventListener("click", click_handler);
  }

  function click_handler(e) {
    if (!Object.keys(temp_choice).includes(e.target.parentNode.id)) {
      temp_choice[e.target.parentNode.id] = [];
    }
    temp_choice[e.target.parentNode.id].push(e.target.id);

    main_button_checkout(temp_choice);
    e.target.removeEventListener("click", click_handler);
    e.target.addEventListener("click", click_handler_second);
    e.target.classList.add("selected");
  }
  
  // Показ элементов
  function change_view_mode(box_name) {
    price_list.style.display = "None";
    cinema_view.style.display = "None";
    time_view.style.display = "None";
    calendar_view.style.display = "None";

    switch (box_name) {
      case "price-list":
        price_list.style.display = "block";
        break;
      case "cinema_view":
        cinema_view.style.display = "block";
        break;
      case "time_view":
        time_view.style.display = "block";
        break;
      case "calendar_view":
        calendar_view.style.display = "block";
        break;
    }
  }

  // Календарь
  function make_calendar() {
    temp_choice = {};
    main_button_checkout(temp_choice);
    tg.BackButton.hide();

    change_view_mode("calendar_view");
    const calendar = document.querySelector(".calendar");
    calendar.innerHTML = `<p class="weekday">Пн</p> <p class="weekday">Вт</p> <p class="weekday">Ср</p> <p class="weekday">Чт</p> <p class="weekday">Пт</p> <p class="weekday">Сб</p> <p class="weekday">Вс</p> `;
    
    console.log(valid_days)
    for (let i = 1; i <= 30; i++) {
      if (valid_days.includes(i.toString())) {
        calendar.innerHTML += `<div id="${i}" class="active">${i}</div>`;
      } else {
        calendar.innerHTML += `<div id="${i}" class="disabled-celendar">${i}</div>`;
      }
    }

    // Обработчикик на кнопки дней
    for (let el in valid_days) {
      document.getElementById(valid_days[el]).addEventListener("click", (e) => {
        user_input["date_choice"] =
          Object.keys(dates)[valid_days.indexOf(e.target.id)];
        set_time(user_input["date_choice"]);
      });
    }
  }

  // Время
  function set_time(date) {
    tg.BackButton.show();
    tg.BackButton.onClick(function () {
      make_calendar();
    });

    change_view_mode("time_view");

    document.querySelector(".time_header_1").innerHTML = date;
    document.querySelector(".avalibal_time").innerHTML = "";

    const time_data = dates[date];
    const time = Object.keys(time_data);

    for (let i in time) {
      document.querySelector(
        ".avalibal_time"
      ).innerHTML += `<div class="time_item" id="${100 + i}">${time[i]}</div>`;
    }

    for (let i in time) {
      document.getElementById(100 + i).addEventListener("click", (e) => {
        user_input["time_choice"] = time[i];
        cinima_grid(dates[date][time[i]], date, time[i]);
      });
    }
  }

  // Сетка мест
  function cinima_grid(palaces, date, time) {
    change_view_mode("cinema_view");

    let cinema_cheme = {};
    let cinema_place = document.querySelector(".cinema_place");
    document.querySelector(".time_header").innerHTML = `${date} ${time}`;

    for (let i in palaces) {
      if (Object.keys(cinema_cheme).includes(palaces[i][0])) {
        cinema_cheme[palaces[i][0]][palaces[i][1]] = palaces[i][2];
      } else {
        cinema_cheme[palaces[i][0]] = {};
        cinema_cheme[palaces[i][0]][palaces[i][1]] = palaces[i][2];
      }
    }

    cinema_place.innerHTML = '<div class="display"></div>';

    for (let i in cinema_cheme) {
      let plases_string = "";

      for (let id in cinema_cheme[i]) {
        let status = cinema_cheme[i][id];
        if (status == "Свободно") {
          plases_string += `<div id="${id}" class="active active_place">${id}</div>`;
        } else {
          plases_string += `<div id="${id}" class="disabled-celendar">${id}</div>`;
        }
      }

      let new_row = `<div id="row_${i}" class="row">${plases_string} </div>`;
      cinema_place.innerHTML += new_row;
    }

    let elements = document.querySelectorAll(".active_place");
    for (let i = 0; i < elements.length; i++) {
      elements[i].addEventListener("click", click_handler);
    }
  }

  function make_price_list(temp_choice, user_input){
    
    tg.MainButton.text = 'Оплатить';
    tg.MainButton.onClick(send);
    
    change_view_mode('price-list');
    save_data();
    
    price_list.querySelector('.card_head').querySelector('h3').innerHTML = `${tg.initDataUnsafe.user.first_name} ${user_input['time_choice']} ${user_input['date_choice']}`;
    price_list.querySelector('.list-items').innerHTML = ''
    
    price = 0;
    for (let i in temp_choice){
      for (let j in temp_choice[i]){
        price_list.querySelector('.list-items').innerHTML += `<div>Ряд ${i.replace('row_', '')}, место ${j}, цена 10р</div>`;
        price += 10;
      }
    }
    price_list.querySelector('.list-items').innerHTML += `Сумма ${price}р`;
  }

  // date_set_func(dates);
  // make_calendar();
}

