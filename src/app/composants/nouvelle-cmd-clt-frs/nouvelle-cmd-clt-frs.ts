import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-nouvelle-cmd-clt-frs',
  standalone: false,
  templateUrl: './nouvelle-cmd-clt-frs.html',
  styleUrl: './nouvelle-cmd-clt-frs.css',
})
export class NouvelleCmdCltFrs implements OnInit {
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
  cancelClick() {
    // Logique pour annuler la commande
    if (this.origin=== 'client') {
      this.router.navigate(['dashboard','nouvellecommandeclt']);
    } else {
      this.router.navigate(['dashboard','nouvellecommandefrs']);
    }
  }
  saveClick() {
    // Logique pour enregistrer la commande
    if (this.origin === 'client') {
      this.router.navigate(['dashboard','nouvellecommandeclt']);
    } else {
      this.router.navigate(['dashboard','nouvellecommandefrs']);
    }
  }
}
