/*
    Database to OOP Adapter (SQLite) for Discord Bots.
    Made with <3 by Ali Poyraz AYDIN (KIGIPUX)
    Feel free to modify and redistribute.
*/

module.exports = {
    name: "SQLite",
    create(dbname){
        let createDatabase = require('better-sqlite3');
        const workingDirectory = process.bot.workingDirectory + "/instance/database/";
        const workingFilename = dbname + ".kyst000.db";
        let db = createDatabase(workingDirectory + workingFilename);
        db.pragma('journal_mode = WAL');
        return db;
    },
    instance(){
        let createDatabase = require('better-sqlite3');
        const workingDirectory = process.bot.workingDirectory + "/instance/database/";
        const workingFilename = process.coreConfig.database.database_name + ".kyst000.db";
        let db = createDatabase(workingDirectory + workingFilename);
        if (process.configuration["Kyst.Database.WALOptimizationEnabled"]) db.pragma('journal_mode = WAL');

        return {
            endInstance(){db.close()},
            global(){
                // Global: (db name is "kyst" and table name is "global")
                let globalUID = -1;
                const tableName = "globalDefinitions";
                db.exec("create table if not exists " + tableName + " (id tinytext primary_key unique not null, value text not null)");
                return {
                    // Table Specs: (db name is "kyst" and table name is "global" and row id is -1)
                    getValue(vid){return JSON.parse((db.prepare('select * from '+tableName+' where id = ?').get(globalUID) || {value: "{}"}).value)[vid]; },
                    setValue(vid, content){
                        let inp = JSON.parse((db.prepare('select value from '+tableName+' where id = ?').get(globalUID) || {value: "{}"}).value);
                        inp[vid] = content;
                        return db.prepare('insert or replace into '+tableName+' values (?,?)').run(globalUID, JSON.stringify(inp));
                    },
                    getAll(){ return JSON.parse((db.prepare('select value from '+tableName+' where id = ?').get(globalUID) || {value: "{}"}).value); },
                    setAll(content){
                        if (content == null || content == undefined) return db.prepare('delete from '+tableName+' where id = ?;').run(globalUID);
                        else return db.prepare('update '+tableName+' set value = ? where id = ?;').run(JSON.stringify(content), globalUID);
                    },
                    user(uid){
                        // Table Specs: (db name is "kyst" and table name is "global" and row id is user id)
                        return {
                            getValue(vid){return JSON.parse((db.prepare('select * from '+tableName+' where id = ?').get(uid) || {value: "{}"}).value)[vid]; },
                            setValue(vid, content){
                                let inp = JSON.parse((db.prepare('select value from '+tableName+' where id = ?').get(uid) || {value: "{}"}).value);
                                inp[vid] = content;
                                return db.prepare('insert or replace into '+tableName+' values (?,?)').run(uid, JSON.stringify(inp));
                            },
                            getAll(){ return JSON.parse((db.prepare('select value from '+tableName+' where id = ?').get(uid) || {value: "{}"}).value); },
                            setAll(content){
                                if (content == null || content == undefined) return db.prepare('delete from '+tableName+' where id = ?;').run(uid);
                                else return db.prepare('update '+tableName+' set value = ? where id = ?;').run(JSON.stringify(content), uid);
                            }
                        }
                    }
                }
            },
            guild(gid){
                // Guild Table: (db name is "kyst" and table name is guild id)
                const guildUID = "-1";
                const tableName = "g_" + gid;
                db.exec("create table if not exists " + tableName + " (id tinytext primary_key unique not null, value text not null)");
                return {
                    // Table Specs: (db name is "kyst" and table name is guild id and row id is -1)
                    getValue(vid){return JSON.parse((db.prepare('select * from '+tableName+' where id = ?').get(guildUID) || {value: "{}"}).value)[vid]; },
                    setValue(vid, content){
                        let inp = JSON.parse((db.prepare('select value from '+tableName+' where id = ?').get(guildUID) || {value: "{}"}).value);
                        inp[vid] = content;
                        return db.prepare('insert or replace into '+tableName+' values (?,?)').run(guildUID, JSON.stringify(inp));
                    },
                    getAll(){ return JSON.parse((db.prepare('select value from '+tableName+' where id = ?').get(guildUID) || {value: "{}"}).value); },
                    setAll(content){
                        if (content == null || content == undefined) return db.prepare('delete from '+tableName+' where id = ?;').run(guildUID);
                        else return db.prepare('update '+tableName+' set value = ? where id = ?;').run(JSON.stringify(content), guildUID);
                    },
                    user(uid){
                        // Table Specs: (db name is "kyst" and table name is guild id and row id is user id)
                        return {
                            getValue(vid){return JSON.parse((db.prepare('select * from '+tableName+' where id = ?').get(uid) || {value: "{}"}).value)[vid]; },
                            setValue(vid, content){
                                let inp = JSON.parse((db.prepare('select value from '+tableName+' where id = ?').get(uid) || {value: "{}"}).value);
                                inp[vid] = content;
                                return db.prepare('insert or replace into '+tableName+' values (?,?)').run(uid, JSON.stringify(inp));
                            },
                            getAll(){ return JSON.parse((db.prepare('select value from '+tableName+' where id = ?').get(uid) || {value: "{}"}).value); },
                            setAll(content){
                                if (content == null || content == undefined) return db.prepare('delete from '+tableName+' where id = ?;').run(uid);
                                else return db.prepare('update '+tableName+' set value = ? where id = ?;').run(JSON.stringify(content), uid);
                            }
                        }
                    }
                }
            }
        }
    }
}