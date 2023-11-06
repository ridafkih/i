import { hash } from "argon2";
import { randomBytes } from "crypto";

console.log();

class EmojiLog {
  private dropEmoji: boolean = false;
  
  constructor(private readonly emoji: string) {}

  log(...segments: string[]) {
    console.log([this.dropEmoji ? " " : this.emoji, ...segments].join("\t"))
    this.dropEmoji = true;
  }

  break() {
    this.dropEmoji = true;
    console.log();
  }
}

const troll = new EmojiLog("🧌");
troll.log("Let's generate the credentials for your 'i' service.");
troll.log("We will generate a seed, then use argon2 to hash it.");
troll.log("The seed is meant to be the value of the Authorization header.");
troll.log("The administrator hash is meant to be set to one of the space-delimited values in the `ADMIN_ARGON2` environment variable of your 'i' service.");

troll.break();

const lock = new EmojiLog("🔐");
const seed = randomBytes(32).toString("hex");
const hashPromise = hash(seed);
hashPromise.then((hash) => {
  lock.log("SEED", seed);
  lock.log("HASH", hash);
});
