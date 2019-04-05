glob = require 'glob-watcher'
{spawn} = require 'child_process'
path = require 'path'
fs = require 'fs'

cwd = process.cwd()

check_mooc = () ->
    new Promise (resolve, reject) ->
        mooc = spawn "moonc", ["-v"]
        mooc.stderr.on "data", reject
        mooc.stdout.on "data", resolve
        return

compile = (file) ->
    moon = spawn 'moonc', [file], 
        cwd: path.dirname file
        stdio: "inherit"

watch = (folders) ->
    console.log folders
    try
        await check_mooc()
    catch e
        console.log "please install moonscript!"
        process.exit -1
        
    watcher = glob folders

    watcher.on "add", compile
    watcher.on "change", compile



conf = ""

try
   conf = fs.readFileSync path.resolve cwd, ".mnc"
        .toString('utf-8')

catch e
    console.log "not font .mnc file"
    process.exit -1

if conf == ""
    console.log ".mnc file is empty"
    process.exit -1

watch conf.split '\n'