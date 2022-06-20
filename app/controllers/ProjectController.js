import axios from 'axios';
import {setAuthStorage} from '../config/Storage';
import httpClient from './HttpClient';

class ProjectController {
  constructor() {
    // this.basePath = '/login_mobile';
    this.basePath = 'http://34.87.121.155:8181/apiwebpbi/api';
  }

  data_project = async email => {
    console.log('email for project di controller', email);
    const data_app = 'O';

    try {
      const result = await httpClient.request({
        // url: '/notification',
        // url: `http://34.87.121.155:2121/apiwebpbi/api/notification?email=${email}&entity_cd=${entity_cd}&project_no=${project_no}`,
        url: `http://34.87.121.155:2121/apiwebpbi/api/getData/mysql/${email.emails}/${data_app}`,
        // url: `http://34.87.121.155:8181/apiwebpbi/api/notification?email=${email}&entity_cd=${entity_cd}&project_no=${project_no}`,
        method: 'GET',
      });
      // alert(result.Pesan);
      console.log('vardums result project -->', result);
      // ini ada isreset dalemnya, sementara dihilangin, buat biar ga nyangkut insert token firebase
      if (result.Error) {
        return Promise.reject(result.Pesan);
      } else {
        return result;
      }
    } catch (error) {
      return Promise.reject(error);
    }
  };
}

export default new ProjectController();
