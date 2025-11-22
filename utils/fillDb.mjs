import User from "../models/user.mjs"
import Event from "../models/event.mjs"
import Role from "../models/role.mjs"
import Organization from "../models/organization.mjs"

// Important!!!
// this function assumps database is already created and it is only used for demo
const fillDB = async () => {

    const today = new Date().toISOString().split('T')[0];
    // Add Admin if there is none in db
    const users = await User.getAllUsers()

    if (users.length == 0)  {
        await User.createUser("admin", "admin@admin", "1234", true)
    }

    // add Roles to table if it is empty
    const roles = await Role.getAllRoles()
    if(roles.length == 0) {
        const roles = ["owner", "staff"]

        roles.forEach( async (r) => {
            await Role.addRole(r)
        })
    }

    const orgs = await Organization.getAllOrganizations()
    if(orgs.length == 0) {

        // Space Concordia
        const scOwnerId = await User.createUser("Simon", "simon@spaceconcordia.ca", "1234", false)

        const scId = await Organization.createOrganization("Space Concordia", "spaceConcordia.webp", "this is Space Concordia", scOwnerId)

        const shrekId = await User.createUser("shrek", "shrek@spaceconcordia.ca","1234", false)
        const amirId = await User.createUser("amir", "amir@spaceconcordia.ca", "1234", false)
        const joshuaId = await User.createUser("joshua", "joshua@spaceconcordia.ca", "1234", false)

        Organization.addUserToOrganization(scId, shrekId, 2)
        Organization.addUserToOrganization(scId, amirId, 2)
        Organization.addUserToOrganization(scId, joshuaId, 2)

        await Event.addEvent("Wine and Cheese", "spaceConcordia_wine.webp", "Meeting spaceconcordia members", "5", "60", today, today, "Hive Cafe", scId)
        await Event.addEvent("CSA Meeting", "spaceConcordia_csa.jpg", "Meet Canadian Space agency", "0", "100", today, today, "H1035", scId)
        await Event.addEvent("Matlab Workshop", "matlab.png", "Learn how to use matlab", "0", "150", today, today, "H935", scId)


        const ieeeOwnerId = await User.createUser("Karim", "karim@ieee.ca", "1234", false)
        const ieeeId = await Organization.createOrganization("IEEE", "ieee_concordia_logo.jpeg", "this is IEEE", ieeeOwnerId)

        const arthurId = await User.createUser("arthur Morgan", "arthur@ieee.ca","1234", false)
        const djessicaId = await User.createUser("djessica", "jes@ieee.ca", "1234", false)

        Organization.addUserToOrganization(ieeeId, arthurId, 2)
        Organization.addUserToOrganization(ieeeId, djessicaId, 2)

        await Event.addEvent("Soldering Workshop", "soldering.jpg", "Learn how to solder", "0", "30", today, today, "Mu annex", ieeeId)
        await Event.addEvent("Robot Wars", "robot_wars.jpg", "Create your own robot and win ultimate price", "50", "50", today, today, "Loyola campus", ieeeId)

        const f1OwnerId = await User.createUser("Parsa", "parsa@f1.ca", "1234", false)
        const f1Id = await Organization.createOrganization("Formula Racing", "Formula.avif", "this is Formula", f1OwnerId)
        
        const geraltId = await User.createUser("Geralt", "geralt@f1.ca","1234", false)
        const aminId = await User.createUser("Amin", "amin@f1.ca", "1234", false)
        const davidId = await User.createUser("David", "david@f1.ca", "1234", false)

        Organization.addUserToOrganization(f1Id, geraltId, 2)
        Organization.addUserToOrganization(f1Id, aminId, 2)
        Organization.addUserToOrganization(f1Id, davidId, 2)
        
        await Event.addEvent("f1 Testing", "concordia_f1_testing.jpg", "Join us and experience f1 testing", "0", "20", today, today, "Hall Building Basement", f1Id)

        const scsOwnerId = await User.createUser("sassan", "sassan@scs.ca", "1234", false)
        const scsId = await Organization.createOrganization("SCS", "scs.jpg", "computer science and software engineering club", scsOwnerId)

        const sukhiId = await User.createUser("Sukhi", "sukhi@scs.ca", "1234", false)
        const halaId = await User.createUser("Hala", "hala@scs.ca", "1234", false)
        const zaraId = await User.createUser("Zara", "zara@scs.ca", "1234", false)

        Organization.addUserToOrganization(scsId, sukhiId, 2)
        Organization.addUserToOrganization(scsId, halaId, 2)
        Organization.addUserToOrganization(scsId, zaraId, 2)

        await Event.addEvent("Leetcode Session", "leetcode.webp", "leetcode practice", "0", "35", today, today, "Online", scsId)
        await Event.addEvent("Job Career Fair", "job.png", "meet employers", "0", "150", today, today, "EV110", scsId)
    
        await User.createUser("rima", "rima@gmail.con", "1234", false)
        await User.createUser("amd", "amd@gmail.com", "1234", false)
    }

}


export default fillDB