import Organization from "../models/organization.mjs"


const getOrganization = (req, res) => {
    
}

const getUserOrganizations = async (req, res) => {
    const user = req.user
    const orgs = await Organization.getUserOrganizations(user.id)
    res.status(200).json(orgs)
}

const getOrgnaizationAnalytics = (req, res) => {
    
}


const createOrganization = (req, res) => {

}


const getOrganizationEvents = (req, res) => {

}

const addUserToOrganization = (req, res) => {
    
}


export default { getOrganization, getUserOrganizations, getOrgnaizationAnalytics, createOrganization, getOrganizationEvents, addUserToOrganization }