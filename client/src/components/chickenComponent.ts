import { Component } from './component';
import { PositionComponent } from './positionComponent';
import { SpriteComponent } from './spriteComponent';
import { ColliderComponent } from './colliderComponent';
import { Scene, IEntityDesc } from '../scene';
import { ILogicComponent } from '../logicSystem';
import { vec3 } from 'gl-matrix';

let dropId = 0;

// # Classe *ChickenComponent*
// Ce composant exécute la logique d'un poulet...
interface IChickenComponentDesc {
  attack: number;
  heartAttackChance: number;
  heartTemplate: IEntityDesc;
  rupeeTemplate: IEntityDesc;
  target: { x: number, y: number },
}

export class ChickenComponent extends Component<IChickenComponentDesc> implements ILogicComponent {
  attack: number;
  private dropped = false;
  private distance = 0;
  private target: vec3;
  private heartAttackChance: number;
  private heartTemplate: IEntityDesc;
  private rupeeTemplate: IEntityDesc;
  private velocity: vec3;

  // ## Méthode *create*
  // Cette méthode est appelée pour configurer le composant avant
  // que tous les composants d'un objet aient été créés.
  create(descr: IChickenComponentDesc) {
    this.target = vec3.fromValues(descr.target.x, descr.target.y, 0);
    this.rupeeTemplate = descr.rupeeTemplate;
    this.heartAttackChance = descr.heartAttackChance;
    this.heartTemplate = descr.heartTemplate;
    this.attack = descr.attack;
  }

  // ## Méthode *setup*
  // Cette méthode détermine la trajectoire du poulet et configure
  // la sprite à utiliser pour son affichage.
  setup() {
    const position = this.owner.getComponent<PositionComponent>('Position');
    this.velocity = vec3.create();
    vec3.subtract(this.velocity, this.target, position.local);
    vec3.normalize(this.velocity, this.velocity);
    vec3.scale(this.velocity, this.velocity, Math.random() * 3 + 2);
    const sprite = this.owner.getComponent<SpriteComponent>('Sprite');
    const dir = (this.velocity[0] > 0) ? 'R' : 'L';
    sprite.spriteName = `C${dir}`;
  }

  // ## Méthode *update*
  // La méthode *update* met à jour la position du poulet. Si il
  // a atteint sa cible, il laisse tomber un rubis. Le poulet est
  // automatiquement détruit si il a parcouru une distance trop
  // grande (il sera déjà en dehors de l'écran).
  update() {
    const position = this.owner.getComponent<PositionComponent>('Position');
    const targetDistanceSq = vec3.squaredDistance(this.target, position.local);
    position.translate(this.velocity);
    const newTargetDistanceSq = vec3.squaredDistance(this.target, position.local);
    if ((!this.dropped) && (newTargetDistanceSq > targetDistanceSq)) {
      this.drop(this.rupeeTemplate, dropId++);
    }

    this.distance += vec3.length(this.velocity);
    if (this.distance > 500) {
      this.owner.parent!.removeChild(this.owner);
    }
  }

  // ## Méthode *drop*
  // Cette méthode instancie un objet au même endroit que le
  // poulet.
  private drop(template: IEntityDesc, id: number) {
    const position = this.owner.getComponent<PositionComponent>('Position');

    template.components!.Position = position.local;
    template.components!.Sprite.spriteSheet = this.owner.getComponent<SpriteComponent>('Sprite').spriteSheet;

    return Scene.current.createChild(template, id.toString(), this.owner.parent!)
      .then((newObj) => {
        this.dropped = true;
      });
  }

  // ## Méthode *onAttack*
  // Cette méthode est appelée quand le poulet se fait attaquer
  onAttack() {
    const toDrop = (Math.random() < this.heartAttackChance) ? this.heartTemplate : this.rupeeTemplate;
    this.drop(toDrop, dropId++);

    const collider = this.owner.getComponent<ColliderComponent>('Collider');
    collider.enabled = false;
    this.velocity[0] *= -1;
    const sprite = this.owner.getComponent<SpriteComponent>('Sprite');
    const dir = (this.velocity[0] > 0) ? 'R' : 'L';
    sprite.spriteName = `C${dir}`;
  }
}
