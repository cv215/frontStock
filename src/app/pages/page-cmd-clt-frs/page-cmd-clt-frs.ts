import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-page-cmd-clt-frs',
  standalone: false,
  templateUrl: './page-cmd-clt-frs.html',
  styleUrl: './page-cmd-clt-frs.css',
})
export class PageCmdCltFrs implements OnInit {
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
  nouvelleCommande() {
    if (this.origin === "client") {
      this.router.navigate(['dashboard', 'nouvellecommandeclt']);
    } else if (this.origin === "fournisseur") {
      this.router.navigate(['dashboard', 'nouvellecommandefrs']);
    }
  }
}
