import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css'],
})
export class PageComponent implements OnInit {
  constructor(private route: ActivatedRoute, private router: Router) {
    const param = this.route.snapshot.paramMap.get('slug');
    console.log(param);
  }
  ngOnInit(): void {}
}
