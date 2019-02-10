import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {ElasticsearchService} from './elasticsearch.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DataTableDirective} from 'angular-datatables';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'Advance searching with elasticsearch';
  searchBox: FormGroup;

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  constructor(
    private _elasticsearch: ElasticsearchService,
    private _formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this._elasticsearch.ping();
    const that = this;
    this.searchBox = new FormGroup(
      {
        'search': this._formBuilder.control('', Validators.required)
      });

    this.dtOptions = {
      pagingType: 'full_numbers',
      serverSide: true,
      searching: false,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
        const data = that.searchBox.value;
        that._elasticsearch.searchDatatables(
          data.search,
          dataTablesParameters.length,
          dataTablesParameters.start
        ).then(resp => {
          callback({
            recordsTotal: resp.hits.total,
            recordsFiltered: resp.hits.total,
            data: resp.hits.hits
          });
        }).catch(error => {
          callback({
            recordsTotal: 0,
            recordsFiltered: 0,
            data: []
          });
        });
      },
      columns: [
        {
          data: '_source.registration_nomor',
          title: 'No',
          orderable: false,
          className: 'center'
        },
        {
          data: null,
          title: 'Informasi halaman',
          orderable: false,
          render: (data: any, type: any, row: any, meta) => {
            return `${data._source.test_filename}`;
          }
        }
      ]
    };
  }

  refresh(data): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
    });
  }


  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }
}
