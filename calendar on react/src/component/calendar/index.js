import React from "react";
import moment from "moment";
import "./calendar.css";
import AddEvents from "./img/plus.png";
import OpenClose from "./img/arrow.png";
import Back from "./img/back.png";
import Save from "./img/save.png";

const localStorageKey = "events";

export default class Calendar extends React.Component {
  eventlist = JSON.parse(localStorage.getItem(localStorageKey)) || {};
  constructor(props) {
    super(props);

    this.state = {
      month: moment(),
      selected: moment().startOf("day"),
      switch: true
    };
  }

  previous = e => {
    if (this.state.switch === true)
      this.setState({
        month: this.state.month.subtract(1, "month")
      });
    else {
      this.setState({
        month: this.state.month.subtract(1, "week")
      });
    }
  };

  next = e => {
    if (this.state.switch === true) {
      this.setState({
        month: this.state.month.add(1, "month")
      });
    } else {
      this.setState({
        month: this.state.month.add(1, "week")
      });
    }
  };

  show_week() {
    if (document.getElementById("week-month").style.visibility === "hidden") {
      document.getElementById("week-month").style.visibility = "visible";
    } else {
      document.getElementById("week-month").style.visibility = "hidden";
    }
  }

  add_events() {
    if (
      document.getElementsByClassName("addEvents")[0].style.visibility ===
      "hidden"
    ) {
      document.getElementsByClassName("addEvents")[0].style.visibility =
        "visible";
    } else {
      document.getElementsByClassName("addEvents")[0].style.visibility =
        "hidden";
    }
  }

  save_events = () => {
    let getelement = document.getElementsByTagName("input");
    let index = moment(this.state.selected).format("l");
    //console.log(this.eventlist[index]);
    if (!this.eventlist[index]) {
      this.eventlist[index] = [];
    }
    this.eventlist[index].push({
      name: getelement[0].value,
      body: getelement[1].value,
      time: getelement[2].value
    });

    localStorage.setItem(localStorageKey, JSON.stringify(this.eventlist));
    this.setState({ selected: this.state.selected });
    for (let i = 0; i < getelement.length; i++) getelement[i].value = "";
    this.add_events();
  };

  select(day) {
    this.setState({
      selected: day.date,
      month: day.date.clone()
    });
  }

  renderWeeks() {
    let weeks = [];
    let done = false;

    if (this.state.switch === true) {
      let date = this.state.month
        .clone()
        .startOf("month")
        .add("w" - 1)
        .day("Sunday");
      let count = 0;
      let monthIndex = date.month();
      const { selected, month } = this.state;
      while (!done) {
        weeks.push(
          <Week
            key={date}
            date={date.clone()}
            month={month}
            select={day => this.select(day)}
            selected={selected}
            eventlist={this.eventlist}
          />
        );

        date.add(1, "w");

        done = count++ > 2 && monthIndex !== date.month();
        monthIndex = date.month();
      }
    } else {
      let date = this.state.month.startOf("week");
      const { selected, month } = this.state;
      weeks.push(
        <Week
          key={date}
          date={date.clone()}
          month={month}
          select={day => this.select(day)}
          selected={selected}
          switch={this.state.switch}
          eventlist={this.eventlist}
        />
      );
    }
    return weeks;
  }
  //  month = () => {
  //    if (this.state.WeekOfmonth) return(this.state.date.format("MMMM"))
  //  else return(moment(this.state.dateWeeker).startOf("week").format("D") + "-" +
  // moment(this.state.dateWeeker).endOf("week").format("D"))}
  renderMonthLabel() {
    if (this.state.switch)
      return (
        <span className="month-label">{this.state.month.format("MMMM")}</span>
      );
    else
      return (
        <span className="month-label">
          {moment(this.state.month).format("MMMM") +
            " " +
            moment(this.state.month)
              .startOf("week")
              .format("D") +
            "-" +
            moment(this.state.month)
              .endOf("week")
              .format("D")}
        </span>
      );
  }
  prev_moth() {
    if (this.state.switch)
      return moment(this.state.month)
        .subtract(1, "month")
        .format("MMM");
    else return "Prev";
  }
  next_month() {
    if (this.state.switch)
      return moment(this.state.month)
        .add(1, "month")
        .format("MMM");
    else return "Next";
  }
  on_week() {
    this.setState({ switch: false });
    this.show_week();
  }
  delete_event = (i, j) => {
    if (!this.eventlist[i]) return false;
    if (this.eventlist[i].length === 1) delete this.eventlist[i];
    else this.eventlist[i].splice(j, 1);

    localStorage.setItem(localStorageKey, JSON.stringify(this.eventlist));
    this.setState({ selected: this.state.selected });
  };
  render() {
    let events = [];

    // array is not null
    for (let i in this.eventlist) {
      if (moment(this.state.selected, "MDYYYY") <= moment(i, "MDYYYY")) {
        events.push(
          <div key={i} className="day-events">
            {moment(i, "MDYYYY").format("dddd,D MMM")}
          </div>
        );

        for (let z = 0; z < this.eventlist[i].length; z++) {
          events.push(
            <div
              key={i + z + i}
              className="box-events"
              onClick={e => {
                this.delete_event(i, z);
              }}
            >
              <div key={this.eventlist[i][z].name} className="name-event">
                {this.eventlist[i][z].name}
              </div>
              <div key={this.eventlist[i][z].body} className="body-event">
                {this.eventlist[i][z].body}
              </div>
              <div key={this.eventlist[i][z].time} className="time-event">
                {this.eventlist[i][z].time}
              </div>
            </div>
          );
        }
      }
    }

    return (
      <section className="calendar">
        <div className="addEvents" style={{ visibility: "hidden" }}>
          <div className="header_ev">
            <span className="back_ev" onClick={this.add_events}>
              <img src={Back} alt="" />
            </span>
            <span className="new_ev">New event</span>
            <span className="save_ev" onClick={this.save_events}>
              <img src={Save} alt="" />
            </span>
          </div>
          <div className="fields">
            <div className="name_ev">
              <p>event name</p>
              <input placeholder="i.e.Prictice" />
              <hr />
            </div>
            <div className="body_ev">
              <p>additional detail</p>
              <input placeholder="i.e.Don`t forget to bring water" />
              <hr />
            </div>
            <div className="time_ev">
              <span>
                <p>starts</p>
                <input type="time" />
              </span>
              <hr />
            </div>
          </div>
        </div>
        <header className="header">
          <div className="events">
            <span
              onClick={e => {
                this.add_events();
              }}
            >
              <img src={AddEvents} alt="" />
            </span>
          </div>
          <div className="month-display row">
            <span className="arrow" onClick={this.previous}>
              {this.prev_moth()}
            </span>
            <span id="elements" onClick={this.show_week}>
              {this.renderMonthLabel()}
              <img className="OpenClose" alt="" src={OpenClose} />
            </span>
            <span className="arrow_1" onClick={this.next}>
              {this.next_month()}
            </span>
          </div>
          <div id="week-month" style={{ visibility: "hidden" }}>
            <span id="button">
              <a
                className="button_1"
                onClick={e => {
                  this.on_week();
                }}
              >
                This week{" "}
              </a>
            </span>
            <span id="button">
              <a
                onClick={e => {
                  this.setState({ switch: true });
                  this.show_week();
                }}
              >
                This month
              </a>
            </span>
          </div>
          <DayNames />
        </header>
        {this.renderWeeks()}
        <div id="div">
          <span className="selected_now">
            {moment(this.state.selected).format("dddd,D MMMM")}
          </span>
        </div>
        {events}
      </section>
    );
  }
}

class DayNames extends React.Component {
  render() {
    return (
      <div className="row day-names">
        <span className="day">S</span>
        <span className="day">M</span>
        <span className="day">T</span>
        <span className="day">W</span>
        <span className="day">T</span>
        <span className="day">F</span>
        <span className="day">S</span>
      </div>
    );
  }
}

class Week extends React.Component {
  render() {
    let days = [];
    let { date } = this.props;
    const { month, selected, select } = this.props;

    for (var i = 0; i < 7; i++) {
      let day = {
        name: date.format("dd").substring(0, 1),
        number: date.date(),
        isCurrentMonth: date.month() === month.month(),
        isToday: date.isSame(new Date(), "day"),
        date: date
      };
      days.push(
        <Day
          key={date}
          day={day}
          selected={selected}
          select={select}
          switch={this.props.switch}
          eventlist={this.props.eventlist}
        />
      );

      date = date.clone();
      date.add(1, "day");
    }

    return (
      <div className="row week" key={days[0]}>
        {days}
      </div>
    );
  }
}

class Day extends React.Component {
  render() {
    const {
      day,
      day: { date, isCurrentMonth, isToday, number },
      select,
      selected
    } = this.props;

    if (this.props.switch === false) {
      return (
        <span
          key={date.toString()}
          className={
            " day" +
            (isToday ? " today" : "") +
            (isCurrentMonth ? "" : " different-week") +
            (date.isSame(selected) ? " selected" : "") +
            (day.date.day() === 0 || day.date.day() === 6 ? " freeday" : "") +
            (this.props.eventlist[day.date.format("l")] ? " event-day" : "")
          }
          onClick={() => select(day)}
        >
          {number}
        </span>
      );
    } else
      return (
        <span
          key={date.toString()}
          className={
            " day" +
            (isToday ? " today" : "") +
            (isCurrentMonth ? "" : " different-month") +
            (date.isSame(selected) ? " selected" : "") +
            (day.date.day() === 0 || day.date.day() === 6 ? " freeday" : "") +
            (this.props.eventlist[day.date.format("l")] ? " event-day" : "")
          }
          onClick={() => select(day)}
        >
          {number}
        </span>
      );
  }
}
