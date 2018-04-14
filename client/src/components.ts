import { IEntity } from './entity';
import { IComponent } from './components/component';
import { AudioComponent } from './components/audioComponent';
import { BackgroundLoaderComponent } from './components/backgroundLoaderComponent';
import { CameraComponent } from './components/cameraComponent';
import { ChickenComponent } from './components/chickenComponent';
import { ChickenSpawnerComponent } from './components/chickenSpawnerComponent';
import { ColliderComponent } from './components/colliderComponent';
import { CountdownComponent } from './components/countdownComponent';
import { EnablerComponent } from './components/enablerComponent';
import { HeartComponent } from './components/heartComponent';
import { InputComponent } from './components/inputComponent';
import { LayerComponent } from './components/layerComponent';
import { LifeComponent } from './components/lifeComponent';
import { PlayerComponent } from './components/playerComponent';
import { PositionComponent } from './components/positionComponent';
import { RawSpriteComponent } from './components/rawSpriteComponent';
import { RefereeComponent } from './components/refereeComponent';
import { RupeeComponent } from './components/rupeeComponent';
import { ScoreComponent } from './components/scoreComponent';
import { SpriteComponent } from './components/spriteComponent';
import { SpriteSheetComponent } from './components/spriteSheetComponent';
import { TextSpriteComponent } from './components/textSpriteComponent';
import { TimerComponent } from './components/timerComponent';
import { DeformationCompositorComponent } from './components/deformationCompositorComponent';
import { RenderCompositorComponent } from './components/renderCompositorComponent';
import { DebugDrawCallsComponent } from './components/debugDrawCallsComponent';

// # Classe *ComponentFactory*
// Cette classe est le point d'entrée pour créer les composants.
interface IComponentCreators {
  [type: string]: new (owner: IEntity) => IComponent;
}

export class ComponentFactory {
  // ## Attribut statique *componentCreators*
  // Ce tableau associatif fait le lien entre les noms des composants
  // tels qu'utilisés dans le fichier JSON et les classes de
  // composants correspondants.
  static componentCreators: IComponentCreators = {
    Audio: AudioComponent,
    BackgroundLoader: BackgroundLoaderComponent,
    Camera: CameraComponent,
    Chicken: ChickenComponent,
    ChickenSpawner: ChickenSpawnerComponent,
    Collider: ColliderComponent,
    Countdown: CountdownComponent,
    Enabler: EnablerComponent,
    Heart: HeartComponent,
    Input: InputComponent,
    Layer: LayerComponent,
    Life: LifeComponent,
    Player: PlayerComponent,
    Position: PositionComponent,
    RawSprite: RawSpriteComponent,
    Referee: RefereeComponent,
    Rupee: RupeeComponent,
    Score: ScoreComponent,
    Sprite: SpriteComponent,
    SpriteSheet: SpriteSheetComponent,
    TextSprite: TextSpriteComponent,
    Timer: TimerComponent,
    DeformationCompositor: DeformationCompositorComponent,
    RenderCompositor: RenderCompositorComponent,
    DebugDrawCalls: DebugDrawCallsComponent,
  };

  // ## Fonction statique *create*
  // Cette fonction instancie un nouveau composant choisi dans
  // le tableau `componentCreators` depuis son nom.
  static create(type: string, owner: IEntity) {
    if (!ComponentFactory.componentCreators[type])
      console.error(type);
    const comp = new ComponentFactory.componentCreators[type](owner);
    comp.__type = type;
    return comp;
  }
}