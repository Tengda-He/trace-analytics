/*
 * SPDX-License-Identifier: Apache-2.0
 *
 * The OpenSearch Contributors require contributions made to
 * this file be licensed under the Apache-2.0 license or a
 * compatible open source license.
 *
 * Modifications Copyright OpenSearch Contributors. See
 * GitHub history for details.
 */

package org.opensearch.observability.model

import org.opensearch.action.ActionRequest
import org.opensearch.action.ActionRequestValidationException
import org.opensearch.action.ValidateActions
import org.opensearch.common.Strings
import org.opensearch.common.io.stream.StreamInput
import org.opensearch.common.io.stream.StreamOutput
import org.opensearch.common.io.stream.Writeable
import org.opensearch.common.xcontent.ToXContent
import org.opensearch.common.xcontent.ToXContentObject
import org.opensearch.common.xcontent.XContentBuilder
import org.opensearch.common.xcontent.XContentParser
import org.opensearch.common.xcontent.XContentParserUtils
import org.opensearch.commons.utils.fieldIfNotNull
import org.opensearch.commons.utils.logger
import org.opensearch.observability.model.RestTag.OBJECT_ID_FIELD
import java.io.IOException

/**
 * Action request for creating new configuration.
 */
internal class UpdateObservabilityObjectRequest : ActionRequest, ToXContentObject {
    val objectId: String
    val type: ObservabilityObjectType
    val objectData: BaseObjectData?

    companion object {
        private val log by logger(UpdateObservabilityObjectRequest::class.java)

        /**
         * reader to create instance of class from writable.
         */
        val reader = Writeable.Reader { UpdateObservabilityObjectRequest(it) }

        /**
         * Creator used in REST communication.
         * @param parser XContentParser to deserialize data from.
         * @param id optional id to use if missed in XContent
         */
        @JvmStatic
        @Throws(IOException::class)
        fun parse(parser: XContentParser, id: String? = null): UpdateObservabilityObjectRequest {
            var objectId: String? = id
            var type: ObservabilityObjectType? = null
            var baseObjectData: BaseObjectData? = null

            XContentParserUtils.ensureExpectedToken(
                XContentParser.Token.START_OBJECT,
                parser.currentToken(),
                parser
            )
            while (parser.nextToken() != XContentParser.Token.END_OBJECT) {
                val fieldName = parser.currentName()
                parser.nextToken()
                when (fieldName) {
                    OBJECT_ID_FIELD -> objectId = parser.text()
                    else -> {
                        val objectTypeForTag = ObservabilityObjectType.fromTagOrDefault(fieldName)
                        if (objectTypeForTag != ObservabilityObjectType.NONE && baseObjectData == null) {
                            baseObjectData =
                                ObservabilityObjectDataProperties.createObjectData(objectTypeForTag, parser)
                            type = objectTypeForTag
                        } else {
                            parser.skipChildren()
                            log.info("Unexpected field: $fieldName, while parsing CreateObservabilityObjectRequest")
                        }
                    }
                }
            }
            objectId ?: throw IllegalArgumentException("$OBJECT_ID_FIELD field absent")
            type ?: throw IllegalArgumentException("Object data field absent")
            baseObjectData ?: throw IllegalArgumentException("Object data field absent")
            return UpdateObservabilityObjectRequest(baseObjectData, type, objectId)
        }
    }

    /**
     * {@inheritDoc}
     */
    override fun toXContent(builder: XContentBuilder?, params: ToXContent.Params?): XContentBuilder {
        builder!!
        return builder.startObject()
            .fieldIfNotNull(OBJECT_ID_FIELD, objectId)
            .field(type.tag, objectData)
            .endObject()
    }

    /**
     * constructor for creating the class
     * @param objectData the ObservabilityObject
     * @param objectId optional id to use for ObservabilityObject
     */
    constructor(objectData: BaseObjectData, type: ObservabilityObjectType, objectId: String) {
        this.objectData = objectData
        this.type = type
        this.objectId = objectId
    }

    /**
     * {@inheritDoc}
     */
    @Throws(IOException::class)
    constructor(input: StreamInput) : super(input) {
        objectId = input.readString()
        type = input.readEnum(ObservabilityObjectType::class.java)
        objectData = input.readOptionalWriteable(
            ObservabilityObjectDataProperties.getReaderForObjectType(
                input.readEnum(
                    ObservabilityObjectType::class.java
                )
            )
        )
    }

    /**
     * {@inheritDoc}
     */
    @Throws(IOException::class)
    override fun writeTo(output: StreamOutput) {
        super.writeTo(output)
        output.writeString(objectId)
        output.writeEnum(type)
        output.writeOptionalWriteable(objectData)
    }

    /**
     * {@inheritDoc}
     */
    override fun validate(): ActionRequestValidationException? {
        var validationException: ActionRequestValidationException? = null
        if (Strings.isNullOrEmpty(objectId)) {
            validationException = ValidateActions.addValidationError("objectId is null or empty", validationException)
        }
        return validationException
    }
}
