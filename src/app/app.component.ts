import {Component, OnInit} from '@angular/core';
import {ElasticsearchService} from './elasticsearch.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Advance searching with elasticsearch';

  constructor(private _elasticsearch: ElasticsearchService) {
  }

  ngOnInit(): void {
    this._elasticsearch.ping();
  }
}
