import axios from 'axios';
import {setAuthStorage} from '../config/Storage';
import httpClient from './HttpClient';

class NotifController {
  constructor() {
    // this.basePath = '/login_mobile';
    this.basePath = 'http://34.87.121.155:8181/apiwebpbi/api';
  }

  notifikasi_nbadge = async (email, entity_cd, project_no) => {
    console.log('email for notif di controller', email);
    console.log('entity for notir', entity_cd);
    console.log('project no for notif', project_no);
    // console.log(
    //   'url for notif',
    //   `http://34.87.121.155:8181/apiwebpbi/api/notification?email=${email}&entity_cd=${entity_cd}&project_no=${project_no}`,
    // );
    // console.log(
    //   'htp client apasi',
    //   httpClient.request({
    //     url: `/notification?email=${email}&entity_cd=${entity_cd}&project_no=${project_no}`,
    //   }),
    // );
    try {
      const result = await httpClient.request({
        // url: '/notification',
        url: 'http://34.87.121.155:2121/apiwebpbi/api/notification?email=haniyya.ulfah@ifca.co.id&entity_cd=01&project_no=01',
        // url: `http://34.87.121.155:8181/apiwebpbi/api/notification?email=${email}&entity_cd=${entity_cd}&project_no=${project_no}`,
        method: 'GET',
        // data: {
        //   email,
        //   entity_cd,
        //   project_no,
        // },
      });
      // alert(result.Pesan);
      console.log('vardums result notifikasi -->', result);
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

export default new NotifController();
