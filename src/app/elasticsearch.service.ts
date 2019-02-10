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

  searchFields(_searchCriteria?: any): any {
    return this.client.search({
      index: 'test_script',
      body: {
        query: {
          multi_match: {
            'type': 'best_fields',
            'query': `${_searchCriteria}`,
            'analyzer': 'standard',
            'fields': [
              'registration_nomor',
              'requirement_name',
              'test_filename'
            ],
            'operator': 'and',
            'auto_generate_synonyms_phrase_query': 'false'
          }
        }
      },
      filterPath: ['hits.hits._source', 'hits.total']
    });
  }

  searchDatatables(_searchCriteria: any, _limit: number = 10, _offset: number = 0) {
    return this.client.search({
      index: 'test_script',
      body: {
        from: _offset,
        size: _limit,
        query: {
          multi_match: {
            'type': 'best_fields',
            'query': `${_searchCriteria}`,
            'analyzer': 'standard',
            'fields': [
              'registration_nomor',
              'requirement_name',
              'test_filename',
              'design_step_name'
            ],
            'operator': 'and',
            'auto_generate_synonyms_phrase_query': 'false'
          }
        }
      },
      filterPath: ['hits.hits._source', 'hits.total']
    });
  }

}
