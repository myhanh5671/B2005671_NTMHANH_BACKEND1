const { ObjectId } = require("mongodb");

class ContactService {
    constructor(client) {
        this.Contact = client.db().collection("contacts");
    }
    
    extractContactData(payload) {
        const contact = {
            name: payload.name,
            email:payload.email,
            address: payload.address,
            phone: payload.phone,
            favorite: payload.favorite,
        };

        Object.keys(contact).forEach(
            (key) => contact[key] === underfined && delete contact[key]
        );
        return contact;
    }
    
    async create(payload) {
        const contact = this.extractContactData(payload);
        const result = await this.Contact.FindOneAndUpdate(
            contact,
            { $set: { favorite: contact.favorite === true } },
            { returnDocument: "after", upsert: true }
        );
        return result;
    }

    async find(filter) {
        const cursor = await this.Contact.find(filter);
        return await cursor.toArray();
    }

    async findByName(name) {
        return await this.find({
            name: { $regex: new RegExp(name), $options: "i" },
        });
    }

    async findByID(id) {
        return await this.Contact.findOne({
            _id: ObjectId(id).isValid(id) ? new ObjectId(id) : null,
        });
    }

    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = this.extractContactData(payload);
        const result = await this.Contact.FindOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        return result;
    }

    async delete(id) {
        const result = await this.Contact.FindOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        })
        return result;
    }
    
    async findFavorite() {
        return await this.find({ favorite: true});
    }

    async deleteAll(id) {
        const result = await this.Contact.deleteMany({})
        return result.deletedCount;
    }
}

module.exports = ContactService;

