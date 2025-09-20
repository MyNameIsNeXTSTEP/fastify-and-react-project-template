import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
  NonAttribute,
} from "@sequelize/core";
import {
  Attribute,
  PrimaryKey,
  NotNull,
  Table,
  Default,
  BelongsTo,
} from "@sequelize/core/decorators-legacy";
import { Account } from "./Account.model.js";

export enum RoundStatus {
  PENDING = "pending", // Cooldown period, round hasn't started yet
  ACTIVE = "active", // Round is currently active, players can tap
  COMPLETED = "completed", // Round has ended
}

@Table({
  tableName: "round",
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ["status"],
    },
    {
      fields: ["start_time"],
    },
    {
      fields: ["end_time"],
    },
    {
      fields: ["winner_id"],
    },
  ],
})
export class Round extends Model<
  InferAttributes<Round>,
  InferCreationAttributes<Round>
> {
  @Attribute(DataTypes.UUID)
  @PrimaryKey
  @Default(DataTypes.UUIDV4)
  declare id: CreationOptional<string>;

  @Attribute(DataTypes.DATE)
  @NotNull
  declare startTime: Date;

  @Attribute(DataTypes.DATE)
  @NotNull
  declare endTime: Date;

  @Attribute(DataTypes.ENUM(...Object.values(RoundStatus)))
  @NotNull
  @Default(RoundStatus.PENDING)
  declare status: RoundStatus;

  @Attribute(DataTypes.BIGINT)
  @NotNull
  @Default(0)
  declare totalPoints: number;

  @Attribute(DataTypes.BIGINT)
  declare winnerId: ForeignKey<Account["id"]> | null;

  @Attribute(DataTypes.DATE)
  @NotNull
  declare readonly createdAt: CreationOptional<Date>;

  @Attribute(DataTypes.DATE)
  @NotNull
  declare readonly updatedAt: CreationOptional<Date>;

  @BelongsTo(() => Account, "winnerId")
  declare winner?: NonAttribute<Account>;

  public isActive(): boolean {
    const now = new Date();
    return (
      this.status === RoundStatus.ACTIVE &&
      now >= this.startTime &&
      now <= this.endTime
    );
  };

  public isPending(): boolean {
    const now = new Date();
    return this.status === RoundStatus.PENDING && now < this.startTime;
  };

  public isCompleted(): boolean {
    return this.status === RoundStatus.COMPLETED;
  };

  public getDuration(): number {
    return this.endTime.getTime() - this.startTime.getTime();
  };

  public getRemainingTime(): number {
    const now = new Date();
    if (this.isCompleted() || now > this.endTime) {
      return 0;
    }
    if (this.isPending()) {
      return this.startTime.getTime() - now.getTime();
    }
    return this.endTime.getTime() - now.getTime();
  };

  public updateStatus(): void {
    const now = new Date();
    if (now < this.startTime) {
      this.status = RoundStatus.PENDING;
    } else if (now >= this.startTime && now <= this.endTime) {
      this.status = RoundStatus.ACTIVE;
    } else {
      this.status = RoundStatus.COMPLETED;
    }
  };
};

export type RoundAttributes = InferAttributes<Round>;
export type RoundCreationAttributes = InferCreationAttributes<Round>;

export default Round;
