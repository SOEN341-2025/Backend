import Organization from "../models/organization.mjs"


const getOrganization = async (req, res) => {
    const id = req.params
    const org = await Organization.getOrganization(id)
    res.status(200).json(org)
}

const getUserOrganizations = async (req, res) => {
    const user = req.user
    const orgs = await Organization.getUserOrganizations(user.id)
    res.status(200).json(orgs)
}

const getOrgnaizationAnalytics = async (req, res) => {
    const id = req.params.id
    let org = await Organization.getOrganization(id)
    org.users = await Organization.getOrganizationUsers(id)
    org.events = await Organization.getOrganizationEvents(id)
    res.status(200).json(org)
}


const createOrganization = (req, res) => {
    //Todo
}

const addUserToOrganization = (req, res) => {
    
}


export default { getOrganization, getUserOrganizations, getOrgnaizationAnalytics, createOrganization, addUserToOrganization }