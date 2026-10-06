import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-nouveau-clt-frs',
  standalone: false,
  templateUrl: './nouveau-clt-frs.html',
  styleUrl: './nouveau-clt-frs.css',
})
export class NouveauCltFrs implements OnInit {
  origin = "";

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
     this.activatedRoute.data.subscribe((data: any) => {
      this.origin = data.origin;
    });
  }
  cancelClick(): void {
   if (this.origin === "client") {
      this.router.navigate(['dashboard','clients']);
    }
      else if (this.origin === "fournisseur") {
      this.router.navigate(['dashboard','fournisseurs']);
    }
  }
  saveClick(): void {
  }
}
