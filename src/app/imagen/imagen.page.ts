import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { lang } from './imagen.lang';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-imagen',
  templateUrl: './imagen.page.html',
  styleUrls: ['./imagen.page.scss'],
})
export class ImagenPage implements OnInit {

  texto = lang.es;
  url: string = '';

  constructor(private route: ActivatedRoute, private platform: Platform) { }

  ngOnInit() {
    this.url = this.route.snapshot.paramMap.get('url');
  }

  downloadFile() {
    this.platform.ready().then(() => {
      if (this.platform.is('hybrid')) {
        /*const filePath = this.file.dataDirectory + 'AmiTravel';
        this.nativeHTTP.downloadFile(this.url, {}, {}, filePath)
        .then(response => {
          console.log('success block...', response);
        }).catch(err => {
          console.log('error block ... ', err.status);
          console.log('error block ... ', err.error);
        });*/
      } else {
        let link: HTMLAnchorElement = document.createElement("a");
        link.download = 'image';
        link.href = this.url;
        link.click();
      }
    });
  }
}
