// // use shell command to save env variable to a temporary file, then return the contents.
// // source: https://stackoverflow.com/questions/39444467/how-to-pass-environment-variable-to-mongo-script/60192758#60192758
function getEnvVariable(envVar, defaultValue) {
    var command = run("sh", "-c", `printenv --null ${ envVar } >/tmp/${ envVar }.txt`);
    // note: 'printenv --null' prevents adding line break to value
    if (command != 0) return defaultValue;
    return cat(`/tmp/${ envVar }.txt`)
  }
print(
  "########### INIT START ###########"
);

const dbUserProd = getEnvVariable('MONGO_DB_PROD_USER', 'app_user')
const dbPwdProd = getEnvVariable('MONGO_DB_PROD_PWD', 'app_user()');
const dbNameProd = getEnvVariable('MONGO_DB_PROD_NAME', 'test');
print(dbUserProd)
db = db.getSiblingDB(dbNameProd);
db.createUser({
  user: dbUserProd,
  pwd: dbPwdProd,
  roles: [{ role: "readWrite", db: dbNameProd }],
});
db.createCollection("users");


const dbUserDev = getEnvVariable('MONGO_DB_DEV_USER', 'app_user')
const dbPwdDev = getEnvVariable('MONGO_DB_DEV_PWD', 'app_user()');
const dbNameDev = getEnvVariable('MONGO_DB_DEV_NAME', 'test');
db = db.getSiblingDB(dbNameDev);
db.createUser({
  user: dbUserDev,
  pwd: dbPwdDev,
  roles: [{ role: "readWrite", db: dbNameDev }],
});
db.createCollection("users");

print(
    "########### INIT END ###########"
);
