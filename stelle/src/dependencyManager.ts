import * as vscode from 'vscode';
import * as child_process from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

const openAIDep = 'openai';
const rootDir = setRootDir();
var dependencies: string[] = [
    'openai'
]; 

function getRootDir() : string { return rootDir; } // Returns Root Directory
function setRootDir() {
    const scriptPath = __filename; // Gets The Path To THIS File
    var parentDir = path.join(path.dirname(scriptPath), ".."); // Goes Up To The Extension Workspace
    return parentDir; // Returns parentDir
}

export function start() {
    vscode.window.withProgress({ // Create A Loading Notification
        location: vscode.ProgressLocation.Notification, // Specify Where
        title: "Stelle's Built-In Dependency Manager Is Running...", // Specify What
        cancellable: false // Don't Allow The User To Cancel This Process
    }, async (progress) => { // Async Due To Needing Other Function To Resolve
        console.log(`Dependency Manager Starting...`); // Inform Dev Of Startup
        var missingDependencies = checkForAllDependencies(); // Store Array Of Missing Dependencies
        installMissingDependencies(missingDependencies); // Install Missing Dependencies Specified By List That Was Just Captured
        return Promise.resolve(); // Resolve Promise To End Loading Notification
    });
    vscode.window.showInformationMessage("You have all required dependencies! Have fun coding with Stelle!"); // Inform User Of Completion
    console.log(`Dependency Manager Shutting Down...`); // Inform Dev of Shutdown
}

function doesDirectoryExist(directoryPath: string): boolean { // Finds If A Directory Exists
    try {
        return <boolean>(fs.existsSync(directoryPath) && fs.statSync(directoryPath).isDirectory()); // Returns a boolean if the directory can be found
    } catch (err : any) { // Catch any errors
        console.error(`Error checking directory existence: ${err.message}`); // Tell Dev About Error
        return false; // Return false, specifying that the directory cannot be found
    }
}

function checkForDependency(dependency : string): boolean { // Checks If Dependency Is On User Device
    var exists = doesDirectoryExist(rootDir + "/node_modules/" + dependency); // Checks if specified dependency is in the 'node_modules' folder, where all dependencies should go.
    console.log(`Looking for ${dependency}...`); // Tell Dev Which Dependency Is Being Inquired
    if (exists) { // If The Dependency Is Found
        console.log(`${dependency} located!`); // Inform Dev That Dependency Is Found
    } else { // If Dependency Is Not Found
        console.log(`${dependency} could not be found...`); // Inform Dev That Dependency Is Not Found
    }
    return exists; // Return Boolean, Informing System Whether Or Not The Dependency Was Found
}

function checkForAllDependencies(): string[] { // Checks For All Dependencies A User Needs
    var missingDependencies: string[] = new Array; // Create A New Empty Array To Store Any Missing Dependencies
    vscode.window.withProgress({ // Create A Progress / Loading Notification
        location: vscode.ProgressLocation.Notification, // Specify Where
        title: "Checking For Any Missing Dependencies...", // Specify What
        cancellable: false // Specify Whether Or Not The User Can Cancel. Since This Is So Important, The User CANNOT
    }, async (progress) => { // It Is Asynchronous Because It Must Wait On Another Function To Complete
        console.log(`Checking For Any Missing Dependencies...`); // Inform Dev That The Manager Is Checking For Any Missing Dependencies

        for (var dependency of dependencies) { // Iterate Through The Stored List Of Dependencies
            if(!checkForDependency(dependency)) { // If The Dependency Is NOT Found
                missingDependencies.push(dependency); // Push The Missing Dependency Onto The 'missingDependencies' Array
            }
        }
        return Promise.resolve(); // Return A Resolution To Your Promise, Ending The Loading Notification
    });
    return missingDependencies; // Return The Array Of Missing Dependencies
}

function installMissingDependencies(missingDependencies : string[]) { // Installs Missing Dependencies To The User's Device
    if (missingDependencies.length > 0) { // If There Is AT LEAST One Missing Dependency
        vscode.window.withProgress({ // Create A Loading Notification
            location: vscode.ProgressLocation.Notification, // Specify Where
            title: "Installing Missing Dependencies...", // Specify What
            cancellable: false // Do Not Allow The User To Cancel This Process
        }, async (progress) => { // Asynchronous Because It Must Wait For Another Function
            console.log(`Dependencies Missing. Begininng To Install Missing Dependencies...`);
            for (var dependency in missingDependencies) { // Iterate Through The Missing Dependencies
                console.log(`Installing ${dependency}...`); // Inform Dev That Dependency Is Being Installed
                executeInstallCmd(dependency); // Execute 'npm install' For Specified Dependency
            }
            return Promise.resolve(); // Return A Resolution To Your Promise, Ending The Loading Notification
        });
    } else { // If There Are 0 Missing Dependencies
        return;
    }
}

function executeInstallCmd(dependency : string) {
    const cmd = `npm install ${dependency}`; // Generate npm Command To Install Dependency
    console.log(`Starting Command "${cmd}"...`); // Inform Dev Of Command To Be Run
    const options = { cwd: getRootDir() }; // Specify Directory Where Command Will Be Installed

    child_process.exec(cmd, options, (error, stdout, stderr) => { // Execute Command
        if (error) { // If There Is An Error
            console.error(`Error executing command: ${error.message}`); // Inform Dev Of Error
            return; // End Command
        }
        console.log(`Command executed successfully: ${cmd}`); // Inform Dev Of Success
        console.log(stdout); // Inform Dev Of Installation
    });
}

