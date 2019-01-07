import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { AppService } from './app.service';
import * as cloneDeep from 'lodash.clonedeep';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'US Geological Survey';
  subTitle = 'Complete Listing Data on Earthquakes in US'
  lastMonday = '';
  show = false;
  startDate = 0;
  endDate = 0;
  listData = [];
  rawData = [];
  sanitizedListData: any;
  constructor(private service: AppService) { };

  ngOnInit() {
    this.getListData();
  }

  /** @method - getListData
   * makes API call to get the list data
   */
  getListData() {
    this.service.listCall().subscribe((data) => {
      this.listData = data;
      this.listData.forEach(element => {
        element['show'] = true;
      });
      this.sanitizedListData = cloneDeep(this.listData);
      this.rawData = cloneDeep(this.listData);
    });
  }

  /** @method getDate(value)
   * to convert time from milliseconds to date
   */
  getDate(value) {
    return moment(value).format("DD MMM YYYY hh:mm a")
  }

  /** @method showExpandCollapse(val)
   *  to show/hide list item 
   * */
  showExpandCollpase(val) {
    this.show = val;
  }

  /** @method getStartEndDate
   *  calculates the start date and end date of previous week
   */
  getStartEndDate() {
    this.getPrevWeekMonday();
    //get the week start date in milliseconds
    this.startDate =
      moment(this.lastMonday + '00:00', "M/D/YYYY HH:mm").valueOf();

    // get the week end date
    let weekEndDate = moment(this.lastMonday).add(6, 'day');
    weekEndDate = moment(weekEndDate).add(23, 'hour');
    weekEndDate = moment(weekEndDate).add(59, 'minute');

    //convert weekEndDate to milliseconds
    this.endDate =
      moment(weekEndDate, "M/D/YYYY 23:59").valueOf();

    // filter listData values in start and end date range
    this.getSpecificRange(this.startDate, this.endDate);
  }


  /** @method getListRange
   * gets the list entries in the range of start and end dates
   * @param startDate - first day of previous week, endDate - last day of previous week
   */
  getSpecificRange(startDate, endDate) {

    for (let item of this.listData) {
      const place = item.properties.place;
      const caPlace = place.includes('CA')
      if (caPlace) {
        if (item.properties.time > startDate && item.properties.time < endDate) {
          item.show = true;
        } else { item.show = false; }
      } else { item.show = false; }
    }

    const fromDate = this.getDate(this.startDate);
    const toDate = this.getDate(this.endDate);
    this.subTitle = `Earthquake details in California between ${fromDate} and ${toDate}`
  }


  /**
   * @method setVisibility(item)
   * set the visibility of the list item on view
   * @param item 
   */
  setVisibility(item) {
    if (item.show) {
      return true;
    }
  }

  /** @reset()
   * reset the list data
   */
  reset() {
    this.listData = cloneDeep(this.rawData);
    this.subTitle = 'Complete Listing Data on Earthquakes in US';
  }

  /** @method getPrevWeekMonday
   *  calculates the first day of previous week
   */
  getPrevWeekMonday() {
    let day = moment().format('dddd');
    switch (day) {
      case 'Monday':
        this.lastMonday = moment().subtract(7, 'days').calendar();
        break;

      case 'Tuesday':
        this.lastMonday = moment().subtract(8, 'days').calendar();
        break;

      case 'Wednesday':
        this.lastMonday = moment().subtract(9, 'days').calendar();
        break;

      case 'Thursday':
        this.lastMonday = moment().subtract(10, 'days').calendar();
        break;

      case 'Friday':
        this.lastMonday = moment().subtract(11, 'days').calendar();
        break;

      case 'Saturday':
        this.lastMonday = moment().subtract(12, 'days').calendar();
        break;

      case 'Sunday':
        this.lastMonday = moment().subtract(13, 'days').calendar();
        break;
    }
  }
}
