class Calendar {
  constructor(id) {
    this.cells = [];
    this.currentMonth = moment();
    this.selectedDate = null;
    this.elcalendar = document.getElementById(id);
    this.showTemplate();
    this.gridbody = this.elcalendar.querySelector(".grid_body");
    this.monthName = this.elcalendar.querySelector(".month-name");
    this.showCells();
  }
  showTemplate() {
    this.elcalendar.innerHTML = this.getTemplate();
    this.addEventListenerToControl();
  }
  getTemplate() {
    let template = `
      <div class="calendar_header">
      <button type="button" class="control control-prev">&lt;</button>
      <span class="month-name"></span>
      <button type="button" class="control control-next">&gt;</button>
    </div>
    <div class="calendar-body">
      <div class="grid">
        <div class="grid_header">
          <span class="grid_cell grid_cell-gh">Lu</span>
          <span class="grid_cell grid_cell-gh">Ma</span>
          <span class="grid_cell grid_cell-gh">Mi</span>
          <span class="grid_cell grid_cell-gh">Ju</span>
          <span class="grid_cell grid_cell-gh">Vi</span>
          <span class="grid_cell grid_cell-gh">Sa</span>
          <span class="grid_cell grid_cell-gh">Do</span>
        </div>
        <div class="grid_body"></div>
      </div>
    </div>
      
        `;
    return template;
  }
  showCells() {
    this.cells = this.generateDates(this.currentMonth);
    if (this.cells === null) {
      console.log("not possible");
      return null;
    }
    this.gridbody.innerHTML = "";
    let templateCells = "";
    let disabledClass = "";
    for (let index = 0; index < this.cells.length; index++) {
      disabledClass = "";
      if (!this.cells[index].isInCurrentMonth) {
        disabledClass = "grid_cell--disabled";
      }
      templateCells += `
       <span class="grid_cell grid_cell--gd ${disabledClass}" data-cell-id="${index}" >
           ${this.cells[index].date.date()}
       </span>
   `;
    }
    this.monthName.innerHTML = this.currentMonth.format("MMM YYYY");
    this.gridbody.innerHTML = templateCells;
    this.addEventListenerToCells();
  }
  generateDates(monthToShow = moment()) {
    if (!moment.isMoment(monthToShow)) {
      return null;
    }
    let dateStart = moment(monthToShow).startOf("month");
    let dateEnd = moment(monthToShow).endOf("month");
    let cells = [];
    //encontrar la primera fecha que se va a mostrar en el calendrio
    while (dateStart.day() !== 1) {
      dateStart.subtract(1, "day");
    }
    //encontrar la ultima fecha que se va a mostrar en el calendrio
    while (dateEnd.day() !== 0) {
      dateEnd.add(1, "day");
    }
    // console.log(dateStart, dateEnd)
    //genera las fechas del grid
    do {
      cells.push({
        date: moment(dateStart),
        isInCurrentMonth: dateStart.month() === monthToShow.month(),
      });
      dateStart.add(1, "days");
    } while (dateStart.isSameOrBefore(dateEnd));
    return cells;
  }
  addEventListenerToControl() {
    let controls = this.elcalendar.querySelectorAll(".control");
    controls.forEach((control) => {
      control.addEventListener("click", (e) => {
        let target = e.target;
        if (target.classList.contains("control-next")) {
          this.changeMonth(true);
        } else {
          this.changeMonth(false);
        }
        this.showCells();
      });
    });
  }
  changeMonth(next = true) {
    if (next) {
      this.currentMonth.add(1, "months");
    } else {
      this.currentMonth.subtract(1, "months");
    }
  }
  addEventListenerToCells() {
    let cells = this.elcalendar.querySelectorAll(".grid_cell--gd");
    cells.forEach((cell) => {
      cell.addEventListener("click", (e) => {
        let target = e.target;
        if (
          target.classList.contains("grid_cell--disabled") ||
          target.classList.contains("grid_cell--selected")
        ) {
          return;
        }
        //deseleccionar celda anterior
        let selectedCell = this.gridbody.querySelector(".grid_cell--selected");
        if (selectedCell) {
          selectedCell.classList.remove("grid_cell--selected");
        }
        //seleccionar nueva celda
        target.classList.add("grid_cell--selected");
        this.selectedDate = this.cells[parseInt(target.dataset.cellId)].date;
        // Lanzar evento change
        this.elcalendar.dispatchEvent(new Event("change"));
      });
    });
  }
  getElement() {
    return this.elcalendar;
  }

  value() {
    return this.selectedDate;
  }
}
