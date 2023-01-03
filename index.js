const Steam = require("steam-webapi");
const config = require("./config.json");
const apikey = config.steam_api_key;
const interval = config.intervals_in_milliseconds;
const sqlite3 = require("sqlite3").verbose();
Steam.key = apikey;
const SteamWorkshopScraper = require("steam-workshop-scraper");
var sws = new SteamWorkshopScraper();

Steam.ready(async function (err) {
  console.log(`Connected to Steam - Interval for checks is every ${interval} milliseconds`);

  let db = new sqlite3.Database("./database.db", (err) => {
    if (err) {
      console.error(err.message);
    }
  });
  await db.run(`CREATE TABLE IF NOT EXISTS mods (mod_id INTEGER, last_updated INTEGER, latest_patchnotes TEXT)`);

  async function modUpdateCheck() {
    if (err) throw err;
    var steam = new Steam();

    const modIDs = config.modIds;

    modIDs.forEach((modID) => {
      steam.getPublishedFileDetails({ itemcount: "1", "publishedfileids[0]": `${modID}` }, async function (err, data) {
        if (err) throw err;
        const getTimeUpdated = data.publishedfiledetails[0].time_updated;
        const getModName = data.publishedfiledetails[0].title;
        const getModID = data.publishedfiledetails[0].publishedfileid;
        const getModThumbnail = data.publishedfiledetails[0].preview_url;
        const getModURL = `https://steamcommunity.com/sharedfiles/filedetails/?id=${getModID}`;
        const getPatchnotes = sws.GetChangeLog(modID).then(async function (data) {
          const patchnotes = data.data[0].text;
          await db.run(`UPDATE mods SET latest_patchnotes = ? WHERE mod_id = ?`, [patchnotes, getModID]);
        });

        let db = new sqlite3.Database("./database.db", (err) => {
          if (err) {
            console.error(err.message);
          }
        });

        const existingMod = await new Promise((resolve, reject) => {
          db.get(`SELECT * FROM mods WHERE mod_id = ?`, [getModID], (err, row) => {
            if (err) {
              reject(err);
            }
            resolve(row);
          });
        });

        if (!existingMod) {
          await db.run(`INSERT INTO mods (mod_id, last_updated, latest_patchnotes) VALUES (?, ?, ?)`, [getModID, getTimeUpdated, getPatchnotes]);
          console.log("\x1b[35m", new Date().toLocaleString() + ` - Added ${getModName} to database`);
        }

        try {
          if (getTimeUpdated > existingMod.last_updated) {
            await db.run(`UPDATE mods SET last_updated = ? WHERE mod_id = ?`, [getTimeUpdated, getModID]);

            sws.GetChangeLog(modID).then(async function (data) {
              const patchnotes = data.data[0].text;
              await db.run(`UPDATE mods SET latest_patchnotes = ? WHERE mod_id = ?`, [patchnotes, getModID]);
            });

            const existingModRecheck = await new Promise((resolve, reject) => {
              db.get(`SELECT * FROM mods WHERE mod_id = ?`, [getModID], (err, row) => {
                if (err) {
                  reject(err);
                }
                resolve(row);
              });
            });

            const latestPatchNotes = existingModRecheck.latest_patchnotes;

            const lastUpdateTimestamp = existingMod.last_updated;
            const lastUpdateDate = new Date(lastUpdateTimestamp * 1000);
            const lastUpdatedOptions = { month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "numeric", second: "numeric" };
            const lastUpdateFormattedDate = lastUpdateDate.toLocaleDateString("en-GB", lastUpdatedOptions);

            const newUpdatedTimestamp = existingModRecheck.last_updated;
            const newUpdatedDate = new Date(newUpdatedTimestamp * 1000);
            const newUpdatedOptions = { month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "numeric", second: "numeric" };
            const newUpdateFormattedDate = newUpdatedDate.toLocaleDateString("en-GB", newUpdatedOptions);

            console.log("\x1b[32m", `**MOD UPDATE DETECTED**\n${getModName} has been updated\nMod ID: ${getModID}\nLast Updated Date: ${lastUpdateFormattedDate}\nNew Updated Date: ${newUpdateFormattedDate}\nThumbnail: ${getModThumbnail}\nMod URL: ${getModURL}\nPatchnotes: ${latestPatchNotes}`);
            await db.close;
          } else {
            console.log("\x1b[36m%s\x1b[0m", new Date().toLocaleString() + ` - No updates for ${getModName}`);
            await db.close;
          }
        } catch (err) {
          return;
        }
      });
    });
  }
  setInterval(modUpdateCheck, interval);
});
