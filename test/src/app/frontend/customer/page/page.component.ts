import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {PageService} from '../../../service/index';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css']
})
export class FrontendPageComponent implements OnInit {

    page : any;
    pageDetail : any = {};

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private pageService : PageService
    ) {}

    ngOnInit() {
        this.route.params.subscribe((params) => {
            this.page = params['page'];
            this.getPage();
        });
    }

    getPage(){
        this.pageService.getPage(this.page).subscribe(data => {                
            this.pageDetail = data.message[0];                                                            
        });
    }


}
