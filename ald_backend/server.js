import express from 'express';
import { Sequelize, DataTypes, Op } from 'sequelize';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';


const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const sequelize = new Sequelize('ald', 'root', 'Areesha1$', {
  host: 'localhost',
  dialect: 'mysql',
});

//affan
import mysql from 'mysql2/promise';
const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "Areesha1$",
  database: "ald",
});

// Define existing models

//MODELS
const Judgment = sequelize.define('Judgment', {
  judgmentId: { type: DataTypes.INTEGER, primaryKey: true },
  judgmentCitation: DataTypes.STRING,
  judgmentNo: DataTypes.STRING,
  judgmentYear: DataTypes.STRING,
  judgmentNoText: DataTypes.TEXT,
  judgmentDOJ: DataTypes.STRING,
  judgmentType: DataTypes.STRING,
  judgmentPetitioner: DataTypes.TEXT,
  judgmentRespondent: DataTypes.TEXT,
  judgmentParties: DataTypes.TEXT,
  courtId: DataTypes.INTEGER,
  judgmentCourtText: DataTypes.TEXT,
  judgmentPetitionerCouncil: DataTypes.TEXT,
  judgmentRespondentCouncil: DataTypes.TEXT,
  judgmentOtherCounsel: DataTypes.TEXT,
  operatorId: DataTypes.INTEGER,
  judgmentEntryDate: DataTypes.STRING,
  judgmentJudges: DataTypes.STRING,
  judgmentDocFile: DataTypes.STRING,
  judgmentJudicialObservation: DataTypes.TEXT,
}, {
  tableName: 'judgment',
  timestamps: false,
});

const JudgmentText = sequelize.define('JudgmentText', {
  judgementTextId: { type: DataTypes.INTEGER, primaryKey: true },
  judgmentId: { type: DataTypes.INTEGER, references: { model: Judgment, key: 'judgmentId' } },
  judgementTextHTML: DataTypes.TEXT,
  judgementTextDeliveredBy: DataTypes.TEXT,
  judgementTextResult: DataTypes.TEXT,
  judgementTextNo: DataTypes.INTEGER,
}, {
  tableName: 'judgementtext',
  timestamps: false,
});

const JudgmentTextPara = sequelize.define('JudgmentTextPara', {
  judgementTextParaId: { type: DataTypes.INTEGER, primaryKey: true },
  judgementTextId: { type: DataTypes.INTEGER, references: { model: JudgmentText, key: 'judgementTextId' } },
  judgementTextParaNo: DataTypes.STRING,
  judgementTextParaText: DataTypes.TEXT,
  judgementTextParaType: DataTypes.STRING,
}, {
  tableName: 'judgementtextpara',
  timestamps: false,
});

// Define new models with new table names and relationships
const ShortNote = sequelize.define('ShortNote', {
  shortNoteId: { type: DataTypes.INTEGER, primaryKey: true },
  judgmentId: { type: DataTypes.INTEGER, references: { model: Judgment, key: 'judgmentId' } },
  shortNoteText: DataTypes.TEXT,
}, {
  tableName: 'shortnote',
  timestamps: false,
});

const ShortNotePara = sequelize.define('ShortNotePara', {
  shortNoteParaId: { type: DataTypes.INTEGER, primaryKey: true },
  shortNoteId: { type: DataTypes.INTEGER, references: { model: ShortNote, key: 'shortNoteId' } },
  shortNoteParaText: DataTypes.TEXT, 
  shortNoteParaLink: DataTypes.TEXT, 
  shortNoteParaJudgmentNo: DataTypes.INTEGER, 
}, {
  tableName: 'shortnotepara',
  timestamps: false,
});

const LongNote = sequelize.define('LongNote', {
  longNoteId: { type: DataTypes.INTEGER, primaryKey: true },
  shortNoteId: { type: DataTypes.INTEGER, references: { model: ShortNote, key: 'shortNoteId' } },
  longNoteText: DataTypes.TEXT,
}, {
  tableName: 'longnote',
  timestamps: false,
});


const LongNotePara = sequelize.define('LongNotePara', {
  longNoteParaId: { type: DataTypes.INTEGER, primaryKey: true },
  longNoteId: { type: DataTypes.INTEGER, references: { model: LongNote, key: 'longNoteId' } },
  longNoteParaText: DataTypes.TEXT,
}, {
  tableName: 'longnotepara',
  timestamps: false,
});

const judgmentsCited = sequelize.define('judgmentsCited', {
  judgmentsCitedId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  judgementTextId: { type: DataTypes.INTEGER, references: { model: JudgmentText, key: 'judgementTextId' } },
  judgmentsCitedParties: { type: DataTypes.STRING, allowNull: true },
  judgmentsCitedReferedCitation: { type: DataTypes.TEXT, allowNull: true }, // Make sure this spelling is correct
  judgmentsCitedEqualCitation: { type: DataTypes.TEXT, allowNull: true },
  judgmentsCitedParaLink: { type: DataTypes.TEXT, allowNull: true },
  judgmentsCitedText: { type: DataTypes.TEXT, allowNull: true }
}, {
  tableName: 'judgmentscited',
  timestamps: false
});


const Topic = sequelize.define('Topic', {
  topicId: { type: DataTypes.INTEGER, primaryKey: true },
  topicName: { type: DataTypes.STRING(300) },
}, {
  tableName: 'topic',
  timestamps: false,
});

const Orders = sequelize.define('Orders', {
  ordersId: { type: DataTypes.INTEGER, primaryKey: true },
  ordersName: { type: DataTypes.STRING(200) },
  ordersCitation: { type: DataTypes.STRING(20) },
  ordersDateTime: { type: DataTypes.STRING(20) },
  ordersFile: { type: DataTypes.STRING(200) },
  ordersAuthor: { type: DataTypes.STRING(100) },
}, {
  tableName: 'orders',
  timestamps: false,
});


const JudgmentTopics = sequelize.define('JudgmentTopics', {
  judgmentTopicsId: { type: DataTypes.INTEGER, primaryKey: true },
  judgmentId: { type: DataTypes.INTEGER, references: { model: Judgment, key: 'judgmentId' } },
  topicId: { type: DataTypes.INTEGER, references: { model: Topic, key: 'topicId' } },
}, {
  tableName: 'judgmenttopics',
  timestamps: false,
});


const JudgmentStatusType = sequelize.define('JudgmentStatusType', {
  judgmentStatusTypeId: { type: DataTypes.INTEGER, primaryKey: true },
  judgmentStatusTypeName: { type: DataTypes.STRING(200) },
  judgmentStatusTypeText: { type: DataTypes.TEXT },
}, {
  tableName: 'judgmentstatustype',
  timestamps: false,
});


const JudgmentStatus = sequelize.define('JudgmentStatus', {
  judgmentStatusId: { type: DataTypes.INTEGER, primaryKey: true },
  judgmentStatusTypeId: { type: DataTypes.INTEGER, references: { model: JudgmentStatusType, key: 'judgmentStatusTypeId' } },
  judgmentId: { type: DataTypes.INTEGER, references: { model: Judgment, key: 'judgmentId' } },
  judgmentStatusALDCitation: { type: DataTypes.STRING(200) },
  judgmentStatusLinkCitation: { type: DataTypes.STRING(200) },
  judgmentStatusLeftRight: { type: DataTypes.STRING }, // Assuming it's a string, you can adjust the type as needed
}, {
  tableName: 'judgmentstatus',
  timestamps: false,
});




const JudgmentCaseNos = sequelize.define('JudgmentCaseNos', {
  judgmentCaseNosId: { type: DataTypes.INTEGER, primaryKey: true },
  judgmentId: { type: DataTypes.INTEGER, references: { model: Judgment, key: 'judgmentId' } },
  judgmentCaseNo: { type: DataTypes.STRING(100) },
  judgmentCaseYear: { type: DataTypes.STRING(10) },
}, {
  tableName: 'judgmentcasenos',
  timestamps: false,
});


const Judge = sequelize.define('Judge', {
  judgeId: { type: DataTypes.INTEGER, primaryKey: true },
  judgeName: { type: DataTypes.STRING(200) },
}, {
  tableName: 'judge',
  timestamps: false,
});


const CourtType = sequelize.define('CourtType', {
  courtTypeId: { type: DataTypes.INTEGER, primaryKey: true },
  courtTypeName: { type: DataTypes.STRING(200) },
  courtTypeDesc: { type: DataTypes.TEXT },
}, {
  tableName: 'courttype',
  timestamps: false,
});


const Court = sequelize.define('Court', {
  courtId: { type: DataTypes.INTEGER, primaryKey: true },
  courtTypeId: { type: DataTypes.INTEGER, references: { model: CourtType, key: 'courtTypeId' } },
  courtName: { type: DataTypes.STRING(200) },
  courtShortName: { type: DataTypes.STRING(20) },
}, {
  tableName: 'court',
  timestamps: false,
});




const Citation = sequelize.define('Citation', {
  citationId: { type: DataTypes.INTEGER, primaryKey: true },
  judgmentId: { type: DataTypes.INTEGER, references: { model: Judgment, key: 'judgmentId' } },
  publicationYearId: { type: DataTypes.INTEGER },
  courtId: { type: DataTypes.INTEGER, references: { model: Court, key: 'courtId' } },
  citationText: { type: DataTypes.STRING(200) },
  publicationVolume: { type: DataTypes.STRING(100) },
  publicationPart: { type: DataTypes.STRING(100) },
  citationCourtName: { type: DataTypes.STRING(200) },
  citationPageNo: { type: DataTypes.INTEGER },
  citationBench: { type: DataTypes.STRING(10) },
}, {
  tableName: 'citation',
  timestamps: false,
});

const EqualCitation = sequelize.define('EqualCitation', {
    equalCitationId: { type: DataTypes.INTEGER, primaryKey: true },
    judgmentId: { type: DataTypes.INTEGER, references: { model: Judgment, key: 'judgmentId' } },
    equalCitationText: { type: DataTypes.STRING(300) },
  }, {
    tableName: 'equalcitation',
    timestamps: false,
  });

// Define associations
Judgment.hasMany(JudgmentText, { foreignKey: 'judgmentId' });
JudgmentText.belongsTo(Judgment, { foreignKey: 'judgmentId' });

JudgmentText.hasMany(JudgmentTextPara, { foreignKey: 'judgementTextId' });
JudgmentTextPara.belongsTo(JudgmentText, { foreignKey: 'judgementTextId' });

JudgmentText.hasMany(judgmentsCited, { foreignKey: 'judgementTextId' });
judgmentsCited.belongsTo(JudgmentText, { foreignKey: 'judgementTextId' });

Judgment.hasMany(ShortNote, { foreignKey: 'judgmentId' });
ShortNote.belongsTo(Judgment, { foreignKey: 'judgmentId' });


Judgment.hasMany(JudgmentTopics, { foreignKey: 'judgmentId' });
JudgmentTopics.belongsTo(Judgment, { foreignKey: 'judgmentId' });

Judgment.hasMany(JudgmentStatus, { foreignKey: 'judgmentId' });
JudgmentStatus.belongsTo(Judgment, { foreignKey: 'judgmentId' });

Judgment.hasMany(JudgmentCaseNos, { foreignKey: 'judgmentId' });
JudgmentCaseNos.belongsTo(Judgment, { foreignKey: 'judgmentId' });

Judgment.hasMany(Citation, { foreignKey: 'judgmentId' });
Citation.belongsTo(Judgment, { foreignKey: 'judgmentId' });




ShortNote.hasMany(ShortNotePara, { foreignKey: 'shortNoteId' });
ShortNotePara.belongsTo(ShortNote, { foreignKey: 'shortNoteId' });

ShortNote.hasMany(LongNote, { foreignKey: 'shortNoteId' });
LongNote.belongsTo(ShortNote, { foreignKey: 'shortNoteId' });

LongNote.hasMany(LongNotePara, { foreignKey: 'longNoteId' });
LongNotePara.belongsTo(LongNote, { foreignKey: 'longNoteId' });


Topic.hasMany(JudgmentTopics, { foreignKey: 'topicId' });
JudgmentTopics.belongsTo(Topic, { foreignKey: 'topicId' });


// JudgmentStatusType and JudgmentStatus
JudgmentStatusType.hasMany(JudgmentStatus, { foreignKey: 'judgmentStatusTypeId' });
JudgmentStatus.belongsTo(JudgmentStatusType, { foreignKey: 'judgmentStatusTypeId' });

// Court and related tables
Court.hasMany(Citation, { foreignKey: 'courtId' });
Citation.belongsTo(Court, { foreignKey: 'courtId' });

CourtType.hasMany(Court, { foreignKey: 'courtTypeId' });
Court.belongsTo(CourtType, { foreignKey: 'courtTypeId' });

//Equals
Judgment.hasMany(EqualCitation, { foreignKey: 'judgmentId' });
EqualCitation.belongsTo(Judgment, { foreignKey: 'judgmentId' });

app.get('/judgments/:judgmentId', async (req, res) => {
  const { judgmentId } = req.params;

  try {
    const judgment = await Judgment.findByPk(judgmentId, {
      include: [
        {
          model: JudgmentText,
          include: [
            {
              model: JudgmentTextPara,
              attributes: ['judgementTextParaText']
            },
            {
              model: judgmentsCited,
              attributes: ['judgmentsCitedParties', 'judgmentsCitedReferedCitation', 'judgmentsCitedEqualCitation', 'judgmentsCitedParaLink']
            }
          ]
        },
        {
          model: ShortNote,
          include: [
            {
              model: ShortNotePara,
              attributes: ['shortNoteParaText']
            },
            {
              model: LongNote,
              include: {
                model: LongNotePara,
                attributes: ['longNoteParaText']
              }
            }
          ],
          attributes: ['shortNoteText']
        },
        {
          model: JudgmentStatus,
          include: [JudgmentStatusType],
        },
        {
          model: EqualCitation,
          attributes: ['equalCitationText']
        }
      ]
    });

    if (!judgment) {
      return res.status(404).json({ error: 'Judgment not found' });
    }

    console.log('Fetched judgment data:', JSON.stringify(judgment, null, 2));
    res.json(judgment);
  } catch (error) {
    console.error('Error fetching judgment:', error.stack); // Log the full error stack
    res.status(500).json({ error: 'Internal Server Error', details: error.message }); // Return error details
  }
});

  //affan
  // Handling GET requests to /api/search
app.get('/api/search', async (req, res) => {
  const { legislationName, section, subsection } = req.query; // Extracting query parameters
  try {
      // Calling the function to get search results based on legislationName, section, and subsection
      const results = await getSearchResults(legislationName, section, subsection);
      // Sending the results as JSON response
      res.json(results);
  } catch (error) {
      // Handling errors - logging and sending 500 Internal Server Error response
      console.error('Error fetching search results:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});
//affan
export async function getSearchResults(legislationName, section, subsection) {
  let connection;
  try {
      connection = await pool.getConnection();
      const query = `
          SELECT 
              j.judgmentId,
              j.judgmentCitation,
              sn.shortNoteId,
              sn.shortNoteText,
              l.legislationId,
              l.legislationName,
              ls.legislationSectionId,
              ls.legislationSectionName,
              lss.legislationSubSectionId,
              lss.legislationSubSectionName
          FROM 
              judgment j
          LEFT JOIN 
              shortnote sn ON j.judgmentId = sn.judgmentId
          LEFT JOIN 
              shortnoteleg snl ON sn.shortNoteId = snl.shortNoteId
          LEFT JOIN 
              legislation l ON snl.legislationId = l.legislationId
          LEFT JOIN 
              shortnotelegsec snls ON sn.shortNoteId = snls.shortNoteId
          LEFT JOIN 
              legislationsection ls ON snls.legislationSectionId = ls.legislationSectionId
          LEFT JOIN 
              shortnotelegsubsec snlss ON sn.shortNoteId = snlss.shortNoteId
          LEFT JOIN 
              legislationsubsection lss ON snlss.legislationSubSectionId = lss.legislationSubSectionId
          WHERE 
              (? IS NULL OR l.legislationName LIKE ?)
              AND (? IS NULL OR ls.legislationSectionName LIKE ?)
              AND (? IS NULL OR lss.legislationSubSectionName LIKE ?)
      `;

      const queryParams = [
          legislationName ? `%${legislationName}%` : null,
          legislationName ? `%${legislationName}%` : null,
          section ? `%${section}%` : null,
          section ? `%${section}%` : null,
          subsection ? `%${subsection}%` : null,
          subsection ? `%${subsection}%` : null
      ];

      const [rows] = await connection.execute(query, queryParams);
      return rows;
  } catch (error) {
      console.error('Error executing query:', error);
      throw error;
  } finally {
      if (connection) {
          connection.release();
      }
  }
}

// API endpoint to fetch judgments along with related data


// API endpoint to search judgments by topic (GET request)
app.get('/judgments/searchByTopic', async (req, res) => {
    const { term } = req.query;

    if (!term) {
        return res.status(400).json({ error: 'Search term is required' });
    }

    try {
        const judgments = await Judgment.findAll({
            include: [
                {
                    model: JudgmentTopics,
                    include: [
                        {
                            model: Topic,
                            where: {
                                topicName: {
                                    [Op.like]: `%${term}%`
                                }
                            },
                            attributes: ['topicName']
                        }
                    ],
                    attributes: []
                }
            ],
            attributes: ['judgmentId', 'judgmentCitation']
        });

        console.log('Judgments found:', judgments);

        if (!judgments.length) {
            return res.status(404).json({ error: 'No judgments found' });
        }

        res.json(judgments);
    } catch (error) {
        console.error('Error searching judgments by topic:', error);
        res.status(500).send('Internal Server Error');
    }
});





//defining articles models
const Articles = sequelize.define('Articles', {
  articlesId: { type: DataTypes.INTEGER, primaryKey: true },
  articlesName: { type: DataTypes.STRING(300) },
  articlesCitation: { type: DataTypes.STRING(100) },
  articlesDateTime: { type: DataTypes.STRING(20) },
  articlesFile: { type: DataTypes.STRING(100) },
  articlesAuthor: { type: DataTypes.STRING(100) },
  articlesYear: { type: DataTypes.STRING(20) },
  articlesPublication: { type: DataTypes.STRING(20) },
  articlesPageNo: { type: DataTypes.STRING(20) },
}, {
  tableName: 'articles',
  timestamps: false,
});

// routes for articles search
app.get('/search', async (req, res) => {
  const { term } = req.query;

  if (!term) {
    return res.status(400).json({ error: "Search term is required" });
  }

  try {
    const articles = await Articles.findAll({
      where: {
        [Op.or]: [
          { articlesName: { [Op.like]: `%${term}%` } },
          { articlesAuthor: { [Op.like]: `%${term}%` } }
        ]
      }
    });

    if (!articles.length) {
      return res.status(404).json({ error: 'No articles found' });
    }

    res.json(articles);
  } catch (error) {
    console.error('Error searching articles:', error);
    res.status(500).send('Internal Server Error');
  }
});


const Judges = sequelize.define('Judges', {
  judgesId: { type: DataTypes.INTEGER, primaryKey: true },
  judgesName: { type: DataTypes.STRING(200) },
  judgesCitation: { type: DataTypes.STRING(100) },
  judgesDateTime: { type: DataTypes.STRING(20) },
  judgesFile: { type: DataTypes.STRING(100) },
  judgesAuthor: { type: DataTypes.STRING(100) },
}, {
  tableName: 'judges',
  timestamps: false,
});

app.get('/search', async (req, res) => {
  const { term } = req.query;

  if (!term) {
    return res.status(400).json({ error: "Search term is required" });
  }

  try {
    const articles = await Articles.findAll({
      where: {
        [Op.or]: [
          { articlesName: { [Op.like]: `%${term}%` } },
          { articlesAuthor: { [Op.like]: `%${term}%` } }
        ]
      }
    });

    if (!articles.length) {
      return res.status(404).json({ error: 'No articles found' });
    }

    res.json(articles);
  } catch (error) {
    console.error('Error searching articles:', error);
    res.status(500).send('Internal Server Error');
  }
});


//routes for judge search
app.get('/searchJudges', async (req, res) => {
  const { term } = req.query;

  if (!term) {
    return res.status(400).json({ error: "Search term is required" });
  }

  try {
    const judges = await Judges.findAll({
      where: {
        [Op.or]: [
          { judgesName: { [Op.like]: `%${term}%` } },
          { judgesAuthor: { [Op.like]: `%${term}%` } }
        ]
      }
    });

    if (!judges.length) {
      return res.status(404).json({ error: 'No judges found' });
    }

    res.json(judges);
  } catch (error) {
    console.error('Error searching judges:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/api/searchByCitation', async (req, res) => {
  const { year, volume, publicationName, pageNo } = req.query;

  try {
      const results = await getSearchByCitation(year, volume, publicationName, pageNo);
      res.json(results);
  } catch (error) {
      console.error('Error fetching search results:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

export async function getSearchByCitation(year, volume, publicationName, pageNo) {
  let connection;
  try {
      connection = await pool.getConnection();
      const query = `
          SELECT 
              c.judgmentId,
              c.citationText
          FROM 
              citation c
          INNER JOIN 
              publicationyear py ON c.publicationYearId = py.publicationYearId
          INNER JOIN 
              publication p ON py.publicationId = p.publicationId
          WHERE 
              (? IS NULL OR py.publicationYearNo = ?)
              AND (? IS NULL OR c.publicationVolume = ?)
              AND (? IS NULL OR p.publicationName = ?)
              AND (? IS NULL OR c.citationPageNo = ?)
      `;

      const queryParams = [
          year || null, year || null,
          volume || null, volume || null,
          publicationName !== 'ALL' ? publicationName : null, publicationName !== 'ALL' ? publicationName : null,
          pageNo || null, pageNo || null
      ];

      const [rows] = await connection.execute(query, queryParams);
      return rows;
  } catch (error) {
      console.error('Error executing query:', error);
      throw error;
  } finally {
      if (connection) {
          connection.release();
      }
  }
}

app.get('/api/searchByNominal', async (req, res) => {
  const { nominal } = req.query;

  if (!nominal) {
      return res.status(400).json({ error: 'Nominal is required' });
  }

  try {
      const results = await getSearchByNominal(nominal);
      res.json(results);
  } catch (error) {
      console.error('Error searching by nominal:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});
export async function getSearchByNominal(nominal) {
  let connection;
  try {
      connection = await pool.getConnection();
      const query = `
          SELECT 
              j.judgmentId,
              j.judgmentCitation,
              j.judgmentParties
          FROM 
              judgment j
          WHERE 
              j.judgmentParties LIKE ?
      `;

      const queryParams = [`%${nominal}%`];

      const [rows] = await connection.execute(query, queryParams);
      return rows;
  } catch (error) {
      console.error('Error executing query:', error);
      throw error;
  } finally {
      if (connection) {
          connection.release();
      }
  }
}


app.get('/api/searchByCaseno', async (req, res) => {
  const { caseType, caseNo, caseYear } = req.query;

  if (!caseType && !caseNo && !caseYear) {
      return res.status(400).json({ error: 'At least one search parameter is required' });
  }

  try {
      const results = await getSearchByCaseno(caseType, caseNo, caseYear);
      res.json(results);
  } catch (error) {
      console.error('Error searching by case number:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});


export async function getSearchByCaseno(caseType, caseNo, caseYear) {
  let connection;
  try {
      connection = await pool.getConnection();
      const query = `
          SELECT 
              j.judgmentId,
              j.judgmentCitation,
              jc.judgmentCaseNo,
              jc.judgmentCaseYear
          FROM 
              judgment j
          INNER JOIN 
              judgmentcasenos jc ON j.judgmentId = jc.judgmentId
          WHERE 
              (? IS NULL OR jc.judgmentCaseNo LIKE ?)
              AND (? IS NULL OR jc.judgmentCaseNo LIKE ?)
              AND (? IS NULL OR jc.judgmentCaseYear LIKE ?)
      `;

      const queryParams = [
          caseType ? `%${caseType}%` : null,
          caseType ? `%${caseType}%` : null,
          caseNo ? `%${caseNo}%` : null,
          caseNo ? `%${caseNo}%` : null,
          caseYear ? `%${caseYear}%` : null,
          caseYear ? `%${caseYear}%` : null,
      ];

      const [rows] = await connection.execute(query, queryParams);
      return rows;
  } catch (error) {
      console.error('Error executing query:', error);
      throw error;
  } finally {
      if (connection) {
          connection.release();
      }
  }
}

//Judges serch for index page
app.get('/api/searchByAdvocate', async (req, res) => {
  const { advocateName } = req.query;

  if (!advocateName) {
      return res.status(400).json({ error: 'Advocate name is required' });
  }

  try {
      const results = await getSearchByAdvocate(advocateName);
      res.json(results);
  } catch (error) {
      console.error('Error searching by advocate name:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

export async function getSearchByAdvocate(advocateName) {
  let connection;
  try {
      connection = await pool.getConnection();
      const query = `
          SELECT 
              j.judgmentId,
              j.judgmentCitation,
              j.judgmentParties,
              a.advocateName
          FROM 
              judgment j
          INNER JOIN 
              judgmentadvocates ja ON j.judgmentId = ja.judgmentId
          INNER JOIN 
              advocate a ON ja.advocateId = a.advocateId
          WHERE 
              a.advocateName LIKE ?
      `;

      const queryParams = [`%${advocateName}%`];

      const [rows] = await connection.execute(query, queryParams);
      return rows;
  } catch (error) {
      console.error('Error executing query:', error);
      throw error;
  } finally {
      if (connection) {
          connection.release();
      }
  }
}


app.get('/api/searchByEquivalent', async (req, res) => {
  const { year, volume, publicationName, pageNo } = req.query;

  try {
      const results = await getSearchByEquivalent(year, volume, publicationName, pageNo);
      res.json(results);
  } catch (error) {
      console.error('Error fetching search results:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

export async function getSearchByEquivalent(year, volume, publicationName, pageNo) {
  let connection;
  try {
      connection = await pool.getConnection();
      let query = `
          SELECT 
              j.judgmentId,
              j.judgmentCitation
          FROM 
              judgment j
          INNER JOIN 
              equalcitation e ON j.judgmentId = e.judgmentId
          WHERE 
              1=1
      `;

      if (year) {
          query += ` AND e.equalCitationText LIKE '%${year}%'`;
      }
      if (volume) {
          query += ` AND e.equalCitationText LIKE '%${volume}%'`;
      }
      if (publicationName && publicationName !== 'ALL') {
          query += ` AND e.equalCitationText LIKE '%${publicationName}%'`;
      }
      if (pageNo) {
          query += ` AND e.equalCitationText LIKE '%${pageNo}%'`;
      }

      const [rows] = await connection.execute(query);
      return rows;
  } catch (error) {
      console.error('Error executing query:', error);
      throw error;
  } finally {
      if (connection) {
          connection.release();
      }
  }
}




// Use import.meta.url and fileURLToPath to get __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use('/pdfs', express.static(path.join(__dirname, 'pdfs')));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

