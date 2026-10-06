import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChangerMotDePasseUtilisateurDto } from '../../../api/models';
import { CategoryService } from '../../../services/cathegory/category-service';

@Component({
  selector: 'app-changer-mot-de-passe',
  standalone: false,
  templateUrl: './changer-mot-de-passe.html',
  styleUrl: './changer-mot-de-passe.css',
})
export class ChangerMotDePasse implements OnInit {
  changerMotDePasse: ChangerMotDePasseUtilisateurDto = {};
  constructor(
    private utili: CategoryService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.utili.findAll().subscribe(res => {
    });
  }
  cancel(): void {
    this.router.navigate(['dashboard','profil']);
  }
}
