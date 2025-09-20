import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
  NonAttribute,
} from '@sequelize/core';
import {
  Attribute,
  PrimaryKey,
  AutoIncrement,
  NotNull,
  Table,
  Default,
  BelongsTo,
  Unique,
} from '@sequelize/core/decorators-legacy';
import { Account } from './Account.model.js';
import { Round } from './Round.model.js';

@Table({
  tableName: 'player_round_stats',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['player_id', 'round_id'],
    },
    {
      fields: ['round_id'],
    },
    {
      fields: ['player_id'],
    },
    {
      fields: ['points'],
    },
  ],
})
export class PlayerRoundStats extends Model<
  InferAttributes<PlayerRoundStats>,
  InferCreationAttributes<PlayerRoundStats>
> {
  @Attribute(DataTypes.BIGINT)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<bigint>;

  @Attribute(DataTypes.BIGINT)
  @NotNull
  declare playerId: ForeignKey<Account['id']>;

  @Attribute(DataTypes.UUID)
  @NotNull
  declare roundId: ForeignKey<Round['id']>;

  @Attribute(DataTypes.BIGINT)
  @NotNull
  @Default(0)
  declare tapCount: number;

  @Attribute(DataTypes.BIGINT)
  @NotNull
  @Default(0)
  declare points: number;

  @Attribute(DataTypes.DATE)
  @NotNull
  declare readonly createdAt: CreationOptional<Date>;

  @Attribute(DataTypes.DATE)
  @NotNull
  declare readonly updatedAt: CreationOptional<Date>;

  @BelongsTo(() => Account, 'playerId')
  declare player?: NonAttribute<Account>;

  @BelongsTo(() => Round, 'roundId')
  declare round?: NonAttribute<Round>;

  public addTap(): number {
    this.tapCount += 1;
    // Calculate points: 1 tap = 1 point, every 11th tap = 10 points
    if (this.tapCount % 11 === 0) {
      this.points += 10;
    } else {
      this.points += 1;
    }
    return this.points;
  };

  public addTaps(count: number): number {
    const oldTapCount = this.tapCount;
    this.tapCount += count;
    // Recalculate points based on new tap count
    this.points = this.calculatePointsFromTaps(this.tapCount);
    return this.points;
  };

  private calculatePointsFromTaps(tapCount: number): number {
    const bonusTaps = Math.floor(tapCount / 11);
    const regularTaps = tapCount - (bonusTaps * 11);
    return regularTaps + (bonusTaps * 10);
  };

  public getEffectivePoints(playerRole: string): number {
    return playerRole === 'guest' ? 0 : this.points;
  };

  public reset(): void {
    this.tapCount = 0;
    this.points = 0;
  };
};

export type PlayerRoundStatsAttributes = InferAttributes<PlayerRoundStats>;
export type PlayerRoundStatsCreationAttributes = InferCreationAttributes<PlayerRoundStats>;

export default PlayerRoundStats;
