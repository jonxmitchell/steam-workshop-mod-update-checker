const Steam = require("steam-webapi");
const apikey = "22F47F57F95F4B1A48C8C757CF66309A";
const sqlite3 = require("sqlite3").verbose();
Steam.key = apikey;
const config = require("./config.json");

Steam.ready(async function (err) {
  let db = new sqlite3.Database("./database.db", (err) => {
    if (err) {
      console.error(err.message);
    }
  });
  await db.run(`CREATE TABLE IF NOT EXISTS mods (mod_id INTEGER, last_updated INTEGER)`);

  async function modUpdateCheck() {
    if (err) throw err;
    var steam = new Steam();

    const modIDs = config.modIds;

    modIDs.forEach((modID) => {
      steam.getPublishedFileDetails({ itemcount: "1", "publishedfileids[0]": `${modID}` }, async function (err, data) {
        if (err) throw err;
        // console.log(data);
        const getTimeUpdated = data.publishedfiledetails[0].time_updated;
        const getModName = data.publishedfiledetails[0].title;
        const getModID = data.publishedfiledetails[0].publishedfileid;

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
          await db.run(`INSERT INTO mods (mod_id, last_updated) VALUES (?, ?)`, [getModID, getTimeUpdated]);
          console.log(`added ${getModName} to database`);
        }

        try {
          if (getTimeUpdated > existingMod.last_updated) {
            console.log("Mod Title: " + getModName, "\n", "Mod ID: " + getModID, "\n", "Last Updated: " + existingMod.last_updated, "\n", "New Updated: " + getTimeUpdated);
            await db.run(`UPDATE mods SET last_updated = ? WHERE mod_id = ?`, [getTimeUpdated, getModID]);

            const existingModRecheck = await new Promise((resolve, reject) => {
              db.get(`SELECT * FROM mods WHERE mod_id = ?`, [getModID], (err, row) => {
                if (err) {
                  reject(err);
                }
                resolve(row);
              });
            });

            console.log(`**MOD UPDATE DETECTED**\n${getModName} has been updated\n New Updated: ${existingModRecheck.last_updated}\n `);
            await db.close;
          } else {
            console.log("no updates");
            await db.close;
          }
        } catch (err) {
          return;
        }
      });
    });
  }
  setInterval(modUpdateCheck, 10000);
});
