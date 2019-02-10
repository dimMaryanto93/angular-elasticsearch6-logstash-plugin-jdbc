import {Injectable} from '@angular/core';
import {environment} from '../environments/environment';
import {Client} from 'elasticsearch-browser';

@Injectable({
  providedIn: 'root'
})
export class ElasticsearchService {

  private client: Client;

  constructor() {
    if (!this.client) {
      this.connect();
    }
  }

  private connect() {
    this.client = new Client({
      host: `${environment.elasticsearchApi}`,
      log: 'info'
    });
  }

  ping() {
    return this.client.ping({
      requestTimeout: Infinity,
      body: 'elasticsearch connected!'
    });
  }

  autocomplateFields(_searchCriteria?: any): any {
    return this.client.search({
      index: 'test_script',
      body: {
        query: {
          multi_match: {
            'type': 'best_fields',
            'query': `${_searchCriteria}`,
            'analyzer': 'standard',
            'operator': 'and',
            'auto_generate_synonyms_phrase_query': 'true'
          }
        }
      },
      filterPath: ['hits.hits._source', 'hits.total']
    });
  }

}
